const path = require('path');

module.exports = {
	entry: "./src/index.js",
	output: {
		path: path.join(__dirname, 'public'),
		filename: "main.js"
	},
	devServer: {
		https: false,
		host: '0.0.0.0',
		port:3000,
		headers: {
            "Access-Control-Allow-Origin": "*" 
        }
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader"
				}
			},
			{
				test: /\.css$/,
				use: ["style-loader", "css-loader"]
			}
		]
	}
}