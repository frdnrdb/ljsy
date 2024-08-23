export const hash = () => {
    return new Date().getTime().toString(36) + '-' + Math.random().toString(36).substring(2);
};

export const stringHash = str => {
    return str
        .split('')
        .reduce((sum, c) => sum + c.charCodeAt(0), 0).toString().replace(
            /\d/g, 
            m => String.fromCharCode(('' + m).charCodeAt(0) + 49)
        );
};