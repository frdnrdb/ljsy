// some.nested.prop => return prop value
// some.arr.0.id => pick first item in array and return item id
// some.arr.?.model => loop array return model from first object with prop model
// some.arr.?.model.title=crazy.id => loop array return id of first object with prop title === crazy from first object with prop model
// some.arr.?.model.title=crazy.arr.?.this=that.arr.7.value => ...and so on

export default (el, str, equals, rest) => {
    if (typeof el !== 'object' || typeof str !== 'string') return;

    const [ props, compare, ...compareRest ] = str.split('=');
    equals = equals || (compare && compare.split('.').shift()); // =[crazy].id
    rest = rest || (compare && compare.split('.').slice(1).join('.')); // =crazy.[id]
    if (compareRest) rest += '=' + compareRest.join('='); // string contains more than one =

    const arr = props.split('.').filter(d => d);

    for (let key of arr) {
        if (key === '?') return traverse();
        if (el[key]) el = el[key];
        else return;
    }

    function traverse() {
        if (!Array.isArray(el)) return;
        for (let item of el) {
            const val = getProp(item, arr.join('.').substring(str.indexOf('?') + 1), equals, rest);

            // TODO? deepequal if object
            if (val && (typeof val === 'string')) {
                // accept substring: string=once upon => string: "once upon a time in the west"
                if (!equals || (equals && val.substring(0, equals.length).toLowerCase() === equals.toLowerCase())) {
                    return compare && rest ? getProp(item, rest) : item;
                }
            }
        }
        return;
    }

    return compare && rest ? getProp(el, rest) : el;
};