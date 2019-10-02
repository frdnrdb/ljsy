/*
    // use MAP to be able to use ELEMENT as key

    set('hello', 'there')
    bind('hello', div, 'innerHTML')
    bind('hello', div.dataset, 'after')
    bind('hello', div, 'attribute.before')
    bind('hello', object {, optional: custom property name })
    bind('hello', input, 'value', 'keyup')

    OR

    bind('hello', input, 'value', 'keyup', 'initial value')

    OR

    bind('hello', [
        [div.dataset, 'after']
        [div, 'attribute.before']
        [object {, optional: custom property name vs 'hello' }]
        [input, 'value', 'keyup']
    ] {, optional: initial value });

    EX

    state.bind(slider.dataset.source + '-title', slider.dataset.title, [
        [qs('header span', slider), 'innerHTML'],
        [summaryTitle, 'innerHTML'],
        [qs('.title', meta), 'value', 'input'],
        [qs('.title', meta), 'value', 'blur'],
        [slider.dataset, 'title'],
        [config.widgets[slider.dataset.source], 'title']
    ], (type, _, e) => {
        if (type === 'blur') {
            refresh.all(preview);
        }
        if (type === 'input' && e.target.nodeName === 'TEXTAREA') {
            if (e.target.scrollHeight > e.target.offsetHeight) {
                e.target.style.height = e.target.scrollHeight + 'px';
            }
        }

    });     

*/

const scope = {};
const bindings = {};

const get = key => scope[key]

const remove = key => {
    delete scope[key]
    bindings[key].map( b => b.event && b.element.removeEventListener(b.event, b.func) );
    delete bindings[key]
}

const set = (key, val) => {
	scope[key] = val
    bindings[key] = bindings[key] || []
    bindings[key].map( b => {
        if (/attribute/.test(b.property)) {
            b.element.setAttribute(b.property.substring(10), val)
        }   
        else b.element[b.property] = val
    })
}

const attach = (key, element, property, event, initialValue, callBack) => {
    const list = Array.isArray(property) && Array.isArray(property[0])
  
    if (list) {
        callBack = event;
    }

	if (!scope.hasOwnProperty(key)) {
        // fallback: prevent Number:0 from returning undefined
        set(key, (list && element) || initialValue || 0) 
    }

    (list ? property : [ property ]).map(args => {
        const [ k, el, prop, e ] = list ? [ key, ...args ] : [ key, element, property, event ];

        bindings[k].push({ element: el, property: prop, event: e })

        if (/attribute/.test(prop)) {
            el.setAttribute(prop.substring(10), scope[k])
        }
        else {
            if (e && el instanceof Element) {
                const func = ev => {
                    set(
                    k, /attribute/.test(prop) 
                        ? el.getAttribute(prop.substring(10)) 
                        : ev instanceof CustomEvent
                            ? ev.detail
                            : el[prop]
                    )
                    callBack && callBack(e, ev.detail || el[prop], ev);
                }
                el.addEventListener(e, func, true)
                bindings[k][bindings[k].length-1].func = func
            }
            prop && (el[prop] = scope[k])
        }
    })
}

export default {
    get,
    set,
    remove,
    attach
}