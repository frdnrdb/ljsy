const _debugElement = () => document.getElementById('dev-debugger') || (div => {
    div.id = 'dev-debugger';
    div.style.position = 'fixed';
    div.style.top = '1em';
    div.style.left = '1em';
    div.style.background = '#000';
    div.style.padding = '.5em';
    div.style.color = '#fff';
    div.style.fontFamily = 'sans-serif';
    return div;
})(document.body.appendChild(document.createElement('div'))); 

export default (...args) => {
    const element = _debugElement();
    const append = (typeof args[0] === 'boolean') && args.shift();
    if (!append) element.innerHTML = '';
    element.innerHTML += args.map(JSON.stringify).join(' ');
};
