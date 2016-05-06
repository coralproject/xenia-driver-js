module.exports = [
  {
    entry: './src/index.js',
    output: {
      filename: 'browser.js',
      path: './dist',
      libraryTarget: "commonjs2",
    },
    module: {
      loaders: [
        { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader"}
      ]
    },
    target: 'web'
  },
  {
    entry: './src/index.js',
    output: {
      filename: 'node.js',
      path: './dist',
      libraryTarget: "commonjs2",
    },
    target: 'node',
    module: {
      loaders: [
        { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader"},
        { test: /\.json$/, loader: "json-loader"}
      ]
    }
  }
]
