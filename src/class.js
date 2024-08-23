/*
    ac, rc, tc
    ac(['hello', 'there']) => body.hello.there
    ac('hello', div) => div.hello
*/
export const classActions = (action, classes, nodes) => {
    classes = Array.isArray(classes) ? classes : [classes]
    nodes = nodes ? Array.isArray(nodes) ? nodes : [nodes] : [document.body]
    classes.map(cls => nodes.map(n => n && n.classList[action](cls)))
}
/*
    is('classname', node) => node.classList.contains('classname')
    is(['one', 'two'], node) => node.classList.contains('one') || node.classList.contains('two')
*/
export const is = (c, n = document.body) => {
    c = Array.isArray(c) ? c : [c]
    return c.reduce((is, v) => {
        if (!is) return n.classList.contains(v);
        return is;
    }, false)
};
export const ac = classActions.bind(null, 'add');
export const rc = classActions.bind(null, 'remove');
export const tc = classActions.bind(null, 'toggle');