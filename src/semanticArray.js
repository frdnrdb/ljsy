/*
    [n, n, n] => n, n {separator} n
*/
export default (n, sep = ' og ') => {
    return n.length
        ? n.shift() + (n.length > 1 ? ', ' + n.slice(0, -1).join(', ') : '') + (n.length ? sep + n.pop() : '')
        : '';
};