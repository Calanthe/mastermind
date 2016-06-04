var path = require('path');
var webpack = require('webpack');

module.exports = {
	context: __dirname, //current folder as the reference to the other paths
	entry: {
		demo: './game.js' //entry point for building scripts
	},
	output: {
		path: path.resolve('./dist'), //save result in 'dist' folder
		filename: 'game.js'
	},
	module: {
		loaders: [
			{ //transpile ES2015 with JSX into ES5
				test: /\.js?$/,
				exclude: /node_modules/,
				loader: 'babel',
				query: {
					presets: ['react', 'es2015']
				}
			}
		]
	}
};