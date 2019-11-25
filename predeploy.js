const fs = require('fs');

const index = fs.readFileSync(__dirname + '/index.js', 'utf8');

const methods = index
    .replace(/^export {([^}]+)}.*$/gm, '$1')
    .replace(/default as /gm, '')
    .replace(/,/gm, '\n')
    .split(/\n/)
    .map(str => str.trim())
    .filter(str => str)

const file = `export default ${JSON.stringify(methods)};`;

fs.writeFileSync(__dirname + '/src/___methods.js', file);