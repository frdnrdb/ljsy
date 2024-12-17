export default (() => {
    const defaultMax = 150;
    const threshold = 10;
    const breakpointRE = /[^a-zA-ZæøåÆØÅ]/;
    const ellipsis = '...';

    let next, prev;

    const calculateBreakpoint = (text, max) => {
      // return immediately if char at max is a valid breakpoint
      if (breakpointRE.test(text.charAt(max))) return max;

      // calculate both forwards and backwards within threshold of max
      // to get the shortest distance to a valid breakpoint
      next = prev = 0;

      for (i = max + 1; i < Math.min(text.length, max + threshold); i++) {
        if (!breakpointRE.test(text.charAt(i))) continue;
        next = i;
        break;
      }
      for (i = max - 1; i >= Math.max(0, max - threshold); i--) {
        if (!breakpointRE.test(text.charAt(i))) continue;
        prev = i;
        break;
      }

      return next && prev
        ? max - prev < next - max
          ? prev
          : next
        : next || prev || max;
    };

    return (text = '', max = defaultMax) => {
      return text.length <= max ? text : `${text.substring(0, calculateBreakpoint(text, max))}${ellipsis}`;
    };
})();