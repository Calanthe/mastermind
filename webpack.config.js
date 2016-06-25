var path = require('path');
var webpack = require('webpack');

module.exports = {
	context: __dirname, //current folder as the reference to the other paths
	entry: {
		game: './game.js' //which file should be loaded on the page
	},
	output: {
		path: path.resolve('./dist'), //where the compiled JavaScript file should be saved
		filename: './game.js', //name of the compiled JavaScript file
		publicPath: '/mastermind_webpack/'
	},
	module: {
		loaders: [
			{
				test: /\.js?$/, //translate and compile ES6 with JSX into ES5
				exclude: /node_modules/,
				loader: 'babel',
				query: { //query configuration passed to the loader
					presets: ['react', 'es2015']
				}
			}
		]
	}
};