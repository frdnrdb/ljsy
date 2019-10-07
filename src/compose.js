export const pipe = (...functions) => input => functions.reduce((mem, func) => func(mem), input);

export const pipeAsync = (...functions) => input => functions.reduce((chain, func) => chain.then(func), Promise.resolve(input));
