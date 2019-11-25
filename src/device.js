export const isTouch = () => {
    if (('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) {
        return true;
    }

    // https://git.io/vznFH
    const mq = query => window.matchMedia(query).matches;
    const prefixes = ' -webkit- -moz- -o- -ms- '.split(' ');
    const query = ['(', prefixes.join('touch-enabled),('), 'heartz', ')'].join('');
    return mq(query);
}

export const detectTouchPad = () => new Promise(resolve => {
    let timestamp, events = 0;

    const types = ['DOMMouseScroll', 'mousewheel'];
    const listen = add => types.forEach(e => document[`${add ? 'add' : 'remove'}EventListener`](e, handler));
    listen(true);

    function handler() {
        timestamp = timestamp || new Date().getTime();
        events++;
        if (new Date().getTime() - timestamp > 50) {
            listen();
            resolve(events > 5 ? true : false);
        }
    }
});

// const isTouchPad = await detectTouchPad();