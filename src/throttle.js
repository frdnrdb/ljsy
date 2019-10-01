export const throttle = (delay, callback) => {
    var previousCall = new Date().getTime();
    return function() {
        var time = new Date().getTime();
        if ((time - previousCall) >= delay) {
            previousCall = time;
            callback.apply(null, arguments);
        }
    };
};