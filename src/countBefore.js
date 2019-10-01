/*
    Occurences of elements with class before node in nodeList
*/
export default (c, n) => {
    return n.parentNode && Array.from(n.parentNode.children, 0, indexOf(n)).reduce((count, node) => {
        return count + (node.classList.contains(c) ? 1 : 0)
    }, 0)
};