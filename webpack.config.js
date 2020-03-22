
var HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path')

module.exports = {
  entry: './src/main.ts',
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
  },
  plugins: [new HtmlWebpackPlugin()],
  devServer: {
    contentBase: path.resolve(__dirname, 'public')
  }
}