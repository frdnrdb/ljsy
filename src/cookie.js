export default {
    get: name => {
        const [ , , found ] = document.cookie.match(new RegExp(`(^|;) ?${name}=([^;]*)(;|$)`)) || [];
        return found;
    },
    set: (name, value, days = 1) => {
        const expires = new Date(new Date().getTime() + 24*60*60*1000 * days).toGMTString();
        document.cookie = `${name}=${value};path=/;expires=${expires}`;
    },
    del: name => {
        document.cookie = `${name}=;expires=-1`;
    }
};