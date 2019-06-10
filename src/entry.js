var info = require('../package.json');
var entry = require('./' + info.main);
module.exports = entry.default;