export const hash = () => {
    return new Date().getTime().toString(36) + '-' + Math.random().toString(36).substring(2);
};