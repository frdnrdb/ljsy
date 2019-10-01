/*
    Append Element | HTML
    (element:child || string, element:parent || document.body)
*/
const cutAndPasteActions = (action, children, parent = document.body) => {
    children = Array.isArray(children) ? children : [ children ];
    return children.map(c => parent[typeof c === 'string' ? 'insertAdjacentHTML' : 'insertAdjacentElement'](action, c));
}
export const append = cutAndPasteActions.bind(null, 'beforeend');
export const prepend = cutAndPasteActions.bind(null, 'afterbegin');
export const before = cutAndPasteActions.bind(null, 'beforebegin');
export const after = cutAndPasteActions.bind(null, 'afterend');