export const qs = (q, p) => (p && p instanceof Element ? p : document).querySelector(q);
export const qsa = (q, p) => Array.from((p || document).querySelectorAll(q));