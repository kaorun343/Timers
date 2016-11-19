const HTMLWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
  entry: {
    main: './src/main/index.ts',
    renderer: './src/renderer/index.ts'
  },
  output: {
    path: './dist',
    filename: '[name].js'
  },
  resolve: {
    extensions: ['', '.ts', '.js']
  },
  module: {
    loaders: [
      { test: /\.ts$/, loader: 'ts' },
      { test: /\.scss$/, loader: ExtractTextPlugin.extract(['css', 'sass']) },
      { test: /\.vue\.html$/, loader: 'vue-template' }
    ]
  },
  plugins: [
    new HTMLWebpackPlugin({ template: './template.html', chunks: ['renderer'] }),
    new ExtractTextPlugin('styles.css')
  ],
  target: 'electron',
  node: {
    __dirname: false
  }
}
