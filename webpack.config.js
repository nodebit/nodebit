var path = require('path')
var webpack = require('webpack')

module.exports = {
  devtool: 'cheap-module-eval-source-map',
  entry: [
    './assets/js/main.js'
  ],
  output: {
    path: path.join(__dirname, '/assets/js'),
    filename: 'bundle.js'
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
  ],
  resolve: {
    alias: {
      "jquery": path.join(__dirname, 'assets', 'js', 'dependencies', 'jquery-2.2.3')
    }
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: [ 'babel' ],
        exclude: [ path.join(__dirname, 'assets', 'js', 'dependencies') , /node_modules/]
      },
      {
        test: /\.css$/,
        loader: "style-loader!css-loader"
      }
    ]
  }
}
