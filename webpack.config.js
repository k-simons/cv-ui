
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
const devMode = process.env.NODE_ENV !== 'production';
const path = require('path')

module.exports = {
  entry: {
      js: './src/main.tsx',
      // scss: "./src/index.scss",
    },
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
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          'css-loader',
          'sass-loader',
        ],
      },
      //{
      //  test: /\.s[ac]ss$/i,
      //  use: [
      //    // Creates `style` nodes from JS strings
      //    'style-loader',
      //    // Translates CSS into CommonJS
      //    'css-loader',
      //    // Compiles Sass to CSS
      //    'sass-loader',
      //  ],
      //  include: [
      //      '/node_modules', '/src'
      //  ]
      //},
    ],
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
  },
  plugins: [
      new HtmlWebpackPlugin(),
      new MiniCssExtractPlugin({
        // Options similar to the same options in webpackOptions.output
        // both options are optional
        filename: devMode ? '[name].css' : '[name].[hash].css',
        chunkFilename: devMode ? '[id].css' : '[id].[hash].css',
      }),
    ],
  devServer: {
    contentBase: path.resolve(__dirname, 'public'),
    port: 7070
  }
}