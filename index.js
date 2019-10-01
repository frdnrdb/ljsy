import create from './src/create';
import { prepend, append, before, after } from './src/paste';
import { qs, qsa } from './src/query';
import { ac, rc, tc, is } from './src/class';
import closest from './src/closest';
import waitFor from './src/waitFor';

import listen from './src/listen';
import triggerEvent from './src/triggerEvent';

import getProp from './src/getProp';
import { flatten, unFlatten } from './src/flatten';
import indexOf from './src/indexOf';
import countBefore from './src/countBefore';
import shuffle from './src/shuffle';
import semanticArray from './src/semanticArray';

import cookie from './src/cookie';
import regex from './src/regex';
import { throttle } from './src/throttle';
import { hash } from './src/hash';
import { slugify } from './src/slufigy';

import { isMobile, isDesktop, isIE, isApp } from './src/userAgent';

import fetcher from './src/fetcher';

export default {
    create,                             // create dom elements
    prepend, append, before, after,     // paste dom elements or html
    qs, qsa,                            // queryselectors
    ac, rc, tc, is,                     // classList modifiers
    closest,
    waitFor,                            // wait for a dom node to occur before continuing

    listen,                             // listen to dom events
    triggerEvent,

    getProp,
    flatten, unFlatten,
    indexOf,                            // current node's index in nodeList
    countBefore,                        // occurences of nodes with class before node in nodeList
    shuffle,                            // randomize array
    semanticArray,                      // 0, 1, 2 {and} 3

    cookie,                             // get, set, del
    regex,                              // common validators
    throttle,
    hash,
    slugify,

    isMobile, isDesktop, isIE, isApp,

    fetcher                             // fetch wrapper
};
