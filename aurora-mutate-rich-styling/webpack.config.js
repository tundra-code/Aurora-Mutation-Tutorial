const path = require("path");
module.exports = {
  entry: "./index.js",
  output: {
    filename: "build/index.js",
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
