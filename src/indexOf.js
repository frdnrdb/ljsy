/*
    Index of node in nodeList
*/
export default n => {
    return n && n.parentNode && Array.prototype.indexOf.call(n.parentNode.children, n);
}