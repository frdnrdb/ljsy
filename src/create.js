/*
    Create Element with props, optionally append to parent or document body
    create and assign: create('div', { className: 'done' })
    create and append: create('div', parentNode || true:document.body)
    create, assign and append: create('div', { className: 'done' }, parentNode || true:document.body)
*/
const nsList = {
    html: 'http://www.w3.org/1999/xhtml',
    svg: 'http://www.w3.org/2000/svg',
    mathml: 'http://www.w3.org/1998/mathml'
}

export function create() {
    const [ type, ...args ] = arguments

    const ns = type.indexOf('-'); // 'svg-path'
    const el = ns > -1
        ? document.createElementNS(nsList[type.substring(0, ns)], type.substring(ns + 1))
		: /^frag/.test(type)
			? document.createDocumentFragment()
			: document.createElement(type);

    const [ parent, body, props ] = args.reduce((arr, arg) => {
        if (arg instanceof Element || arg instanceof DocumentFragment) arr[0] = arg // parentNode
        else if (typeof arg === 'boolean') arr[1] = arg && document.body // true | false
        else arr[2] = arg; // {}
        return arr
    }, [])

    props && addProps(el, props);
    (parent || body) && (parent || body).appendChild(el)
    
    return props && props.children 
        ? Array.prototype.concat(el, Array.from(el.children)) 
        : el
}

/*
    Add event-listener(s) (to node or array of nodes)
    (string:event || [string:event, string:event], node, function, bool:bubbles)
    Remove event-listener
    node.unListen.click()
*/

export function listen(e, n, f, b) {
    b = b || false;
    const arr = typeof e === 'string' ? [e] : e
    const list = n instanceof Element || n === window || n === document ? [n] : n
    arr.forEach( ev => {
        list.forEach(el => {
            el.addEventListener(ev, f, b)
            el.unListen = el.unListen || {}
            el.unListen[ev] = () => el.removeEventListener(ev, f, b)
        })
    })
}

/*
    addProps({ hello: 'there' }, { 'this.is.something': 'nice' })
    => { hello: 'there', this: { is: { something: 'nice' } } }
    (skips DOM element read-only props)
*/
export function addProps(obj, o) {
    //const dom = obj instanceof Element
    Object.entries(o).forEach( ([ key, val ]) => {

        const keys = key.split('.')

        keys.reduce( (obj, key, i) => {
            if (/style|dataset/.test(key)) {
                Object.keys(o[key]).map( k => {
                    obj[key][k] = o[key][k]
                })
            }
            else if (/attr/.test(key)) {
                Object.keys(o[key]).map( k => {
                    obj.setAttribute(k, o[key][k])
                })
            }
            else if (key === 'listen') {
                /*
                    listen: {
                        event: 'click',
                        func: e => {}
                        bubbles: true
                    }
                */
                listen(o[key].event, obj, o[key].func, o[key].bubbles)
            }
            else if (key === 'on') {
                /*
                    on: {
                        click: e => {}
                    }
                */
                Object.entries(o[key]).map(([ event, func ]) => {
                    listen(event, obj, func, false)
                })
            }
            else if (/^(func|callback|cb|ready)$/.test(key)) {
                /*
                    element created and inserted callback function
                    ready: node => {}
                */
                listen('DOMNodeInserted', obj, cb.bind(null, o[key], obj), true)

                function cb(func, node) {
                    node.unListen.DOMNodeInserted();
                    func(node);
                }
            }
            else if (/^(done|inserted)$/.test(key)) {
                listen('DOMNodeInsertedIntoDocument', obj, cb.bind(null, o[key], obj), true)
                function cb(func, node) {
                    node.unListen.DOMNodeInsertedIntoDocument();
                    func(node);
                }
            }            
            else if (key === 'before') {
				// immediate callback - apply before dom insertion
			   	o[key](obj);
            }
            else if (/^child/.test(key)) {
                const children = Array.isArray(o[key]) ? o[key] : [ o[key] ];
                children.forEach(c => {
                    const type = c.type || 'div';
                    delete c.type;
                    create(type, obj, c);
                });
            }
            else {
                obj[key] = obj[key] || (i + 1 < keys.length ? {} : val)
            }

            return obj[key]

        }, obj)
    })

    return obj
}