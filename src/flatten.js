/*

obj

{
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
  "shaves": {
    "in": {
      "the": "dark"
    }
  },
  "sleeps": {
    "in": {
      "a": {
        "hole": {
          "in": {
            "the": "road"
          }
        }
      }
    }
  },
  "pick-test": {
    "what": "saving up to",
    "for": "buy some clothes"
  }
}

flatten(obj)

{
  "mean.mister.mustard.sleeps.in.the": "park",
  "shaves.in.the": "dark",
  "sleeps.in.a.hole.in.the": "road",
  "pick-test.what": "saving up to",
  "pick-test.for": "buy some clothes"
}  

flatten(obj, { pick: { 'pick-test': { key: 'what', value: 'for' } } })

{
  "mean.mister.mustard.sleeps.in.the": "park",
  "shaves.in.the": "dark",
  "sleeps.in.a.hole.in.the": "road",
  "saving up to": "buy some clothes"
}  

flatten(obj, { keep: [ 'sleeps' ]})

{
  "mean.mister.mustard.sleeps": {
    "in": {
      "the": "park"
    }
  },
  "shaves.in.the": "dark",
  "sleeps": {
    "in": {
      "a": {
        "hole": {
          "in": {
            "the": "road"
          }
        }
      }
    }
  },
  "pick-test.what": "saving up to",
  "pick-test.for": "buy some clothes"
}  

flatten(obj, { merge: [ 'sleeps', 'shaves' ]})

{
  "mean.mister.mustard.sleeps": "park",
  "shaves": "dark",
  "sleeps": "road",
  "pick-test.what": "saving up to",
  "pick-test.for": "buy some clothes"
}  

*/

export const flatten = (obj, options = {}) => {
	const flat = {};

	for (let i in obj) {
        if (!obj.hasOwnProperty(i)) continue;

        // don't flatten [skip] properties
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
                const key = options.merge && options.merge.indexOf(i) > -1 ? i : `${i}.${x}`;
                flat[key] = flatObject[x];
            }
        }
        else {
			flat[i] = obj[i];
		}
	}
	return flat;
};

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