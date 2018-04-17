const path = require("path");

module.exports = {
  entry: "./index.js", //tells webpack where to start
  output: {
    filename: "./build/index.js", //tells webpack the output
    libraryTarget: "commonjs2"
  },
  module: {
    loaders: [
      { test: /\.js$/, loader: "babel-loader", exclude: /node_modules/ },
      { test: /\.jsx$/, loader: "babel-loader", exclude: /node_modules/ },
      { test: /\.css$/, loader: "style-loader!css-loader" }
    ]
  }
};
