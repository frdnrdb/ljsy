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