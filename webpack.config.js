const path = require('path');
const info = require('./package.json');

module.exports = {
  entry: './src/entry.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: info.main,
    library: info.lib_name,
    libraryTarget: 'var'
  },
  devServer: {
    contentBase: './src'
  },
  mode: 'development'
};
