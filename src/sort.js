export const sort = {
    ascending: (a, b) => {
        return a > b ? 1 : a < b ? -1 : 0;
    },
    descending: (a, b) => {
        return a > b ? -1 : a < b ? 1 : 0;
    }
};
