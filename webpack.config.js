const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const path = require('path')

const config = {
  entry: {
    'wheels': './src/index'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    library: "wheels", 
    libraryTarget: "umd",
  },
  module: {
    rules: [
      {test: /\.(js|jsx)$/, use: 'babel-loader'}
    ]
  },
  plugins: [
    //new webpack.optimize.UglifyJsPlugin(),
    //new HtmlWebpackPlugin({
      //template: './src/demo.html',
      //filename: 'demo.html'
    //})
  ]
};

module.exports = config;
