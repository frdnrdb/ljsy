export const shuffle = (arr, randomized = []) => {
    while (arr.length) {
        const index = Math.floor(Math.random() * arr.length);
        randomized.push(arr[index]);
        arr.splice(index, 1);
    }
    return randomized;
};