// obj: { a: { b: 'c' } } => obj: { 'a.b': 'c' }
// options.keep: input [ key, ... ], don't flatten  these
// options.merge: input [ key, ... ], replaces existing top level properties with nested
// options.pick: input example { contacts: { key: 'type', value: 'value' } }, pick and reassign properties
//   (root) contacts: [ { type: 'mail', value: 'a@b.c' } ] => (root) mail: 'a@b.c'
/*
export const in =  {
        "mean": {
            "mister": {
                "mustard": {
                    "sleeps": {
                        "in": {
                            "the": "park"
                        }
                    }
                }
            }
        },
        "in": "replace this with nested property"
        "shaves": {
            "in": "the dark"
        },
        "sleeps in": {
            "pick": "picked",
            "a hole": "in the road"
        }
    }
    flattenObject(o, { keep: ['sleeps'], merge: ['in'], pick: [ { 'pick': 'zorro' } ] })
export const out =
    {
    "mean.mister.mustard.sleeps": {
        "in": {
        "the": "park"
        }
    },
    "in": "replace this with nested property",
    "shaves.in": "the dark",
    "sleeps in.pick": "picked",
    "sleeps in.a hole": "in the road"
    }
export const out =  { mean.mister.mustard.sleeps.in.the: "park" }

*/
export const flatten = (obj, options = {}) => {
	const flat = {};

	for (let i in obj) {
        if (!obj.hasOwnProperty(i)) continue;

        // don't flatten skip properties
        const keep = options.keep && options.keep.indexOf(i) > -1;

        if (!keep && (typeof obj[i]) === 'object') {

            // pick only certain properties from nested object and reassign
            const pick = options.pick && Object.keys(options.pick).indexOf(i) > -1;
            if (pick) {
                const pickList = Array.isArray(obj[i]) ? obj[i] : [ obj[i] ];
                pickList.map(item => {
                    flat[item[options.pick[i].key]] = item[options.pick[i].value];
                });
                continue;
            }
            const flatObject = flatten(obj[i], options);
            for (let x in flatObject) {
                if (!flatObject.hasOwnProperty(x)) continue;

                // merge replace properties
                const key = options.merge && options.merge.indexOf(i) > -1
                    ? x
                    : `${i}.${x}`;
                flat[key] = flatObject[x];
            }
        }
        else {
			flat[i] = obj[i];
		}
	}
	return flat;
};

/*
export const in =  { 'mean.mister.mustard' : { 'sleeps.in.the': 'park' } }
export const out =  {
        "mean": {
            "mister": {
                "mustard": {
                    "sleeps": {
                        "in": {
                            "the": "park"
                        }
                    }
                }
            }
        }
    }
*/
export const unFlatten = obj => {
    return Object.keys(obj).reduce((o, k) => {
        const parts = k.split('.');

        if (!parts.length) {
            return (o[k] = obj[k]);
        }

        parts.reduce((o, p, i) => (
            o.hasOwnProperty(p)
                ? o[p]
                : i === parts.length - 1
                    ? (o[p] = unFlatten(obj[k]))
                    : (o[p] = {})
        ), o);

        return o;
    }, {});
};