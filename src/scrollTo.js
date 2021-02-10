const easingFunctions = {
    easeInOutQuad: (t, b, c, d) => {
        t /= d/2;
        if (t < 1) return c/2*t*t + b;
        t--;
        return -c/2 * (t*(t-2) - 1) + b;
    }
};

export const scrollTo = (to, callback, parent = window, duration = 360) => {
    const parentIsWindow = parent === window;
    const yScroll = parentIsWindow ? 'scrollY' : 'scrollTop';

    to = isNaN(to)
        ? parentIsWindow
            ? to.getBoundingClientRect().top + parent[yScroll]
            : to.offsetTop
        : to;

    if (!duration) {
        parent.scrollTo(0, to);
        callback && callback();
        return;
    }

    requestAnimationFrame(() => {
        var start = parent[yScroll],
            change = to - start,
            currentTime = 0,
            increment = 20;

        var animateScroll = function(){
            currentTime += increment;
            var val = easingFunctions.easeInOutQuad(currentTime, start, change, duration);
            parent.scrollTo(0, val);
            if(currentTime < duration) {
                setTimeout(animateScroll, increment);
            }
            else {
                callback && callback();
            }
        };
        animateScroll();
    })
};