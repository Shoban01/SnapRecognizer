var path = require('path');

module.exports = {
  
  mode: 'development',
  entry: ['react-hot-loader/patch','./app/app.js'],
  output: {
	  path: path.join(__dirname, "/dist"),
	  filename: "app.js"
  },
  module: {
	  rules: [
		{
			test: /\.js?$/,
			exclude: /node_modules/,
			loader: 'babel-loader'
		},
		{
			test: /\.css?$/,
			use:[{loader: 'style-loader'},{loader: 'css-loader'}]
		}
	]
  },
  devServer: {
	hot: true,
	hotOnly: true,
    contentBase: path.join(__dirname, './'),
    compress: true,
    port: 9000,
	index: "index.html",
	overlay: true,
	headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
    "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
  }
  }
};