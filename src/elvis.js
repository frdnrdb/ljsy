export default function( query, settings, callback, done ) {

    if ( window === 'undefined' || !query ) return;
    if (typeof settings === 'function') callback = settings;

    var config = Object.assign({
        control: 'debounce',    // throttle or debounce
        delay: 200,             // event phrequency
        y: 50,                  /* positive value: n percentage of element height must be visible to trigger
                                    negative value: triggers n pixels before element is visible
                                    object: {
                                        lazy: -200,     // lazyload something 200px before element is visible
                                        trigger: 50     // trigger something when 50% of element is visible
                                    }
                                */
        x: false,               // true: complete element width must be visible to trigger 
        ms: 0,                  // element must be visible at least x ms
        frequency: 100,         // impression time (ms) read interval
        stop: true,             // remove listener if all elements were elvis
        parent: window          // alternatively a container for eg. horizontal scrolling
    }, settings || {});

    var parentIsWindow = config.parent === window;

    var list = typeof query === 'string' 
        ? Array.from((parentIsWindow ? document : config.parent).querySelectorAll(query))
        : query instanceof NodeList
            ? Array.from(query)
            : query instanceof (window.Element || window.HTMLElement || window.Node)
                ? [ query ]
                : query; // assuming array of dom nodes

    if ( !list.length ) return;

    var instanceKeys = isNaN(config.y) ? Object.keys(config.y) : [0];
    var instances = Array(instanceKeys.length).fill(1);
    var states = Array(list.length).fill(0);
    var handler = moderators(config.control)(config.delay, check);

    list.map(function(el) {
        el._instances = instances.slice();
        el._elvis = { destroy: removeEvents };
    });

    function check() {
        list.remaining = 0;
        list.map(checkElVis);

        if (list.remaining === 0) {
            if (config.stop) {
                removeEvents();
            }
            typeof done === 'function' && done();
        }
    }

    function checkElVis(el, i) {
        if (!el) return;

        if (isElVis(el, i)) {
            if (!states[i]) entering(el, i);
            // reset intermediates for { stop: false } config (exit and re-enter callbacks)
            !config.stop && (el._instances = instances.slice());
        }
        else leaving(el, i);
        list.remaining++;
    }

    function isElVis(el, i) {
        var h = window.innerHeight || document.documentElement.clientHeight;
        var w = window.innerWidth || document.documentElement.clientWidth;

        var b = el.getBoundingClientRect();
        updateDirection(el, b);

        el._instances.map(function(instance, n) {
            if (!instance) return;

            var cy = instances.length > 1 ? config.y[instanceKeys[n]] : config.y,
                py = cy && cy > 0 ? config.x ? b.width - b.width * (cy / 100) : b.height * (cy / 100) : 0,
                pre = cy && cy < 0 ? Math.abs(cy) : 0,
                wt = (b.top > 0-py-pre) && (b.top < h-py+pre),
                wb = (b.bottom < h-py+pre) && (b.bottom > 0+py-pre),
                vt = config.x
                    ? (b.left > 0+py-pre) && (b.right < w+py+pre)
                    : (b.top > 0-py-pre) && (b.top < h-py+pre),
                vb = config.x 
                    ? (b.right < w+py+pre) && (b.left > 0-py-pre)
                    : (b.bottom < h-py+pre) && (b.bottom > 0+py-pre);

            if ((wt || wb) && (vt || vb)) {
                el._instances[n] = 0;
                el._instances.length > 1 && callback(el, response(i, el, 'intermediate', instanceKeys[n]));
            }
        });

        return el._instances.reduce(function(sum, i){ return sum += i; }, 0) === 0;
    }

    function timer(el, i) {
        el._vis += config.frequency;
        if (el._vis < config.ms) {
            el._timer = setTimeout(timer.bind(null, el, i), config.frequency);
            return;
        }
        if (config.stop) {
            el._stop = true;
            list[i] = 0;
        }
        callback(el, response(i, el, 'enter'));
    }

    function entering(el, i) {
        states[i] = 1;

        if (!el._stop) {
            if (!el._vis) el._vis = 0;
            if (!el._timer) timer(el, i);
        }

        config.x && !config.removed && removeEvents(true);
    }

    function leaving(el, i) {
        if (!states[i]) return;

        clearTimeout(el._timer);
        el._timer = 0;
        states[i] = 0;

        callback(el, response(i, el, 'exit'));
    }

    function response(i, el, msg, intermediateKey) {
        var o = { 
            state: msg,
            direction: el._direction, 
            id: i + 1,
            count: list.length
        };  
        o[msg] = true;
        if (intermediateKey) {
            o[intermediateKey] = true;
        }
        return o;
    }

    function updateDirection(el, b) {
        var mt = el._t - b.top;
        var ml = el._l - b.left;

        el._direction = Math.abs(mt) === Math.abs(ml)
            ? 'none'
            : Math.abs(mt) > Math.abs(ml)
                ? mt > 0 ? 'up' : 'down'
                : ml > 0 ? 'left' : 'right';

        el._t = b.top;                
        el._l = b.left;             
    }    

    function moderators(key) {
        return {
            throttle: function(delay, fn) {
                var init = new Date().getTime();
                return function() {
                    var now = new Date().getTime();
                    if ((now - init) >= delay) {
                        init = now;
                        fn();
                    }
                };
            },
            debounce: function(timeout, fn) {
                var timer = null;
                return function() {
                    if (!timer) {
                        timer = setTimeout(function () {
                            fn();
                            timer = 0;
                        }, timeout);                    
                    }
                }
            }              
        }[key]; 
    }   

    function removeEvents(windowOnly) {
        config.removed = true;
        window.removeEventListener('scroll', handler, true); 
        if (windowOnly || parentIsWindow) return;
        config.parent.removeEventListener('scroll', handler, true);
    }

    window.addEventListener('scroll', handler, true);
    !parentIsWindow && config.parent.addEventListener('scroll', handler, true);

    check();
}