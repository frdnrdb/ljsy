/*
    closest('test', childNode, '{tag|class|dataset|attribute}')

    closest('div', childNode) => return closest parent with tag div
    closest('test', childNode, 'dataset') => return closest parent with dataset.test
    closest('test', childNode, attribute) => return closest parent with attribute test

    closest('test', childNode, 'class') => return closest parent with class test
    closest('.test', childNode) => return closest parent with class test

*/
export default (selector, p, type, equals) => {
    if (!p) return;
    let inside;

    const char = selector.charAt(0);
    char === '.' && ([ selector, type ] = [ selector.substring(1), 'class' ]);
    char === '#' && ([ selector, type, equals ] = [ 'id', 'attribute', selector.substring(1) ]);

    const check = p => type === 'class'
                ? p.classList.contains(selector)
                : type === 'dataset'
                    ? p.dataset[selector]
                    : type === 'attribute'
                        ? (attr => equals ? attr === equals : !!attr)(p.getAttribute(selector))
                        : p.nodeName === selector || p.nodeName === selector.toUpperCase();

    while ((inside = p) !== document.documentElement && !check(p)) {
        p = p.parentElement;
    }

    return inside && check(p) && p;
};
