const path = require('path');
const info = require('./package.json');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
	entry: './src/lib.js',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: info.lib_name + '.min.js',
		library: info.lib_name
	},
	devServer: {
		writeToDisk: true,
		compress: true,
		port: 9000
	},
	optimization: {
		minimizer: [new TerserPlugin()],
	},
	mode: 'development'
};
