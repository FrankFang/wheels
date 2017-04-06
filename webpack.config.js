const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const path = require('path')

const config = {
  entry: {
    'demo': './src/demo'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    library: "wheels",
    libraryTarget: "umd",
  },
  module: {
    rules: [
      { test: /\.(js|jsx)$/, use: 'babel-loader' },
      {
        test: /\.(css)$/,
        use: [
          { loader: "style-loader" },
          { loader: "css-loader" },
        ],
      },
    ]
  },
  plugins: [
    //new webpack.optimize.UglifyJsPlugin(),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html'
    })
  ],
  devtool: 'eval',
  devServer: {
    stats: 'errors-only',
  }
}

module.exports = config
