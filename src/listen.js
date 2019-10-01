/*
    Add event-listener(s) (to node or array of nodes)
    (string:event || [string:event, string:event], node, function, bool:bubbles)
    Remove event-listener
    node.unListen.click()
*/

export default (e, n, f, b) => {
    b = b || false;
    const arr = typeof e === 'string' ? [e] : e
    const list = n instanceof Element || n === window || n === document ? [n] : n
    arr.forEach( ev => {
        list.forEach(el => {
            el.addEventListener(ev, f, b)
            el.unListen = el.unListen || {}
            el.unListen[e] = () => el.removeEventListener(ev, f, b)
        })
    })
};