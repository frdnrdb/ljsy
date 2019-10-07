export const parseUrl = (url = location.href) => {
    const [ base = '/', queryString = '' ] = url.split('?');
    const [ host, parts ] = base.replace(/^https?:\/\/(www\.)?/, '').split('/');
    const [ hostName, port ] = host.split('.')[0].split(':');
    return {
        host: hostName,
        port,
        params: (parts || []).filter(p => p),
        query: (() => queryString.split('&').reduce((q, pair) => {
            const [key, val] = pair.split('=');
            if (key) q[key] = val;
            return q;
        }, {}) || {})(),
        queryString,
        url
    };
};