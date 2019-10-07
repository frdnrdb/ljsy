export const hasCssProperty = prop => typeof window.getComputedStyle(document.body)[prop] !== 'undefined';
