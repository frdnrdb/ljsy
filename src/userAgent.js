export const isMobile = () => {
    return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
};

export const isIE = () => {
    const ua = window.navigator.userAgent;
    const msie = ua.indexOf('MSIE ');
    if (msie > 0) {
        return `ie-${parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10)}`;
    }
    const trident = ua.indexOf('Trident/');
    if (trident > 0) {
        var rv = ua.indexOf('rv:');
        return `trident-${parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10)}`;
    }
    const edge = ua.indexOf('Edge/');
    if (edge > 0) {
        return `edge-${parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10)}`;
    }
};


export const isDesktop = (typeof window.orientation == "undefined")
    || !/IEMobile|Android|webOS|iPhone|BlackBerry|Windows Phone/i.test(navigator.userAgent)
    || (window.innerWidth > 600);

export const isApp = window.navigator.userAgent.indexOf('_app_') > -1 || window.hasOwnProperty('__HYPERION_ENV__');


/*

        // adapt pixels/time per common browser (based on 5 min mac os browser trials)
        // runs smoothly in firefox and chrome, kind of jagged in safari
        const increment = (() => {
            const config = {
                Firefox: 25,
                Chrome: 25,
                Safari: 100
            };
            const ua = navigator.userAgent;
            const browser = Object.keys(config)
                .filter(browser => ua.indexOf(browser) > -1)
                .shift();

            return config[browser];
        })();



*/