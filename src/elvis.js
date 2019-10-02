// TODO! add IntersectionObserver

export default function( query, settings, callback ) {

    if ( window === 'undefined' || !query ) return;
    if (typeof settings === 'function') {
        callback = settings;
    }

    var list = typeof query === 'string' 
        ? [].slice.call( document.querySelectorAll( query ) ) 
        : [ query ];

    if ( !list.length ) return;

    var config = Object.assign({
        control: 'throttle',
        delay: 50,          // throttle: fire each x event, debounce: fire after x ms
        pre: 0,             // triggers x scroll distance before 
        y: 50,              // x percentage of element height must be visible to trigger 
        x: false,           // true: complete element width must be visible to trigger 
        ms: 0,              // element must be visible at least x ms
        frequency: 100,     // impression time read interval
        stop: true,         // remove listener if all elements were elvis
        parent: window
    }, settings || {});   
    
    var states = Array(list.length).fill(0);
    var direction = 'down';

    var moderators = {
        throttle: function(delay, callback) {
            var previousCall = new Date().getTime();
            return function() {
                var time = new Date().getTime();
                if ((time - previousCall) >= delay) {
                    previousCall = time;
                    callback.apply(null, arguments);
                }
            };
        },
        debounce: function(delay, callback) {
            var timeout = null;
            return function () {
                if (timeout) clearTimeout(timeout);
                var args = arguments;
                timeout = setTimeout(function () {
                    callback.apply(null, args);
                    timeout = 0;
                }, delay);
            };
        }     
    };        

    var handler = moderators[config.control](config.delay, check);
    config.parent.addEventListener('scroll', handler, false);
    check();

    return function(){
        end(true);
    }

    function end(force) {
        (config.stop || force) && config.parent.removeEventListener('scroll', handler, false);
    }

    function check() {
        updateDirection();

        list.remaining = 0;
        list.map(checkElVis);

        if (list.remaining === 0) {
            callback && callback(null, {}, true);
            end();
        } 
    }

    function checkElVis(el, i) {
        if (!el) return;
        if (isElVis(el)) {
            if (!states[i]) entering(el, i);
        }
        else leaving(el, i);
        list.remaining++;
    }

    function isElVis(el) {
        var b = el.getBoundingClientRect(),
            h = window.innerHeight || document.documentElement.clientHeight,
            w = window.innerWidth || document.documentElement.clientWidth,
            py = config.y ? b.height * (config.y / 100) : 0,
            pre = config.pre,
            vt = (b.top > 0-py-pre) && (b.top < h-py+pre),
            vb = (b.bottom < h-py+pre) && (b.bottom > 0+py-pre),
            vx = config.x ? (b.left > 0) && (b.right < w) : true;
        return (vt || vb) && vx;
    }

    function timer(el, i) {
        el.vis += config.frequency;
        if (el.vis < config.ms) {
            el.timer = setTimeout(timer.bind(null, el, i), config.frequency);
            return;
        }
        if (config.stop) {
            el.stop = true;
            list[i] = 0;
        }
        callback && callback(el, response(i, 'enter'));
    }

    function entering(el, i) {
        if (!el.ms) {
            callback && callback(el, response(i, 'enter'));
            list[i] = 0;
            return;
        }

        states[i] = 1;

        if (!el.stop) {
            if (!el.vis) el.vis = 0;
            if (!el.timer) timer(el, i);
        }
    }

    function leaving(el, i) {
        if (!states[i]) return;

        clearTimeout(el.timer);
        el.timer = 0;
        states[i] = 0;

        callback && callback(el, response(i, 'exit'));
    }

    function response(i, msg) {
        return { 
            state: msg, 
            direction: direction, 
            item: i+1 + '/' + list.length 
        };  
    }

    function updateDirection() {
        var t = config.parent.pageYOffset || config.parent.scrollTop || document.documentElement.scrollTop;
        direction = t > (updateDirection.y || 0) ? 'down' : 'up';
        updateDirection.y = t;
    }    
}