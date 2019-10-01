export default async (url, options = {}, type = 'json') => {
    try {
        const res = await fetch(url, options);
        if (res.status !== 200) {
            console.error(`${res.status} - ${res.statusText}: ${url}`);
            return;
        }
        return await res[type]();
    }
    catch(err) {
        console.error(`${url}: ${err.message}`);
    }
};