export default async (url, options = {}, type) => {
    try {
        const res = await fetch(url, options);
        if (res.status !== 200) {
            throw `${res.status} - ${res.statusText}: ${url}`;
        }

        const mime = type || (ct => /json/.test(ct) ? 'json' : /image/.test(ct) ? 'blob' : 'text')(res.headers.get('content-type'));
        return await res[mime]();
    }
    catch(err) {
        console.warn(url, err);
    }
};