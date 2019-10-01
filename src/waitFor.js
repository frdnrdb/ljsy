/*
    waitFor('.selector', callback(node) {})
*/
export default (query, callback, count = 20) => {
    const found = typeof query === 'string'
        ? document.querySelector(query)
        : Array.isArray(query) && query[1] instanceof Element
            ? query[1].querySelector(query[0])
            : Array.isArray(query) && typeof query[0] === 'object'
                && typeof query[1] === 'string'
                && query[0].hasOwnProperty(query[1])
                && query[0][query[1]];
    if (!found && count-- >= 0) {
        return setTimeout(waitFor.bind(null, query, callback, count), 250);
    }
    if (found) callback(found);
};