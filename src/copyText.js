export default function(text, cb) {
    const copyInput = document.getElementById('copy-input') || (input => {
        input.id = 'copy-input';
        input.style.position = 'fixed';
        input.style.left = '-9999px';
        return input;
    })(document.body.appendChild(document.createElement('input'))); 

    copyInput.value = unescape(text);
    copyInput.select();
    document.execCommand('copy');
    window.getSelection().removeAllRanges();
    cb && cb();
}