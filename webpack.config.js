module.exports = [
  {
    entry: './src/index.js',
    output: {
      filename: 'browser.js',
      path: './dist',
      libraryTarget: "commonjs2",
      target: "browser"
    },
    module: {
      loaders: [
        { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader"}
      ]
    }
  },
  {
    entry: './src/index.js',
    output: {
      filename: 'node.js',
      path: './dist',
      libraryTarget: "commonjs2",
      target: "node"
    },
    module: {
      loaders: [
        { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader"}
      ]
    }
  }
]
