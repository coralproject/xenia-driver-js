module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'index.js',
    path: './dist',
    libraryTarget: "commonjs2"
  },
  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader"}
    ]
  }
}
