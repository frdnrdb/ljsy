export default function(text, limit = 80, readMore = false) {
    if (!text) return '';

    let temp = document.createElement('div');
    temp.innerHTML = text;

    text = Array.from(temp.childNodes)
        .filter( ({ nodeName, nodeType }) => nodeName === 'P' || nodeType === 3 )
        .map( ({ textContent }) => textContent )
        .join('')
        .trim();

    temp = undefined;

    if (text.length <= limit) return text;

    let cut = text.substring(0, limit);
    cut = cut.replace(/<[^>]*>/g, '');
    const pos = Math.max( cut.lastIndexOf('.'), cut.lastIndexOf(' ') );
    const short = (pos > -1 ? cut.substring(0, pos) : cut) + '...';

    return short + (readMore ? ' <div>Les mer</div>' : '');
}