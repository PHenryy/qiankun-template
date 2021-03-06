const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
// const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const ESLintPlugin = require("eslint-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = (env) => {
  return {
    mode: env.NODE_ENV,
    entry: "./src/index.js",
    output: {
      filename: "main-app.js",
      path: path.resolve(__dirname, "../dist"),
      publicPath: "/",
    },
    module: {
      rules: [
        {
          test: /\.(js)$/,
          exclude: /node_modules/,
          use: ["babel-loader"],
        },
        {
          test: /\.css$/i,
          use: ["style-loader", "css-loader"],
        },
      ],
    },
    devServer: {
      contentBase: "./dist",
      historyApiFallback: true,
      port: 8080,
      proxy: {
        "/apollo": {
          target: "http://10.10.38.183:11071",
          pathRewrite: {
            "^/apollo": "",
          },
        },
      },
    },
    plugins: [
      // new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        template: "index.html",
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: __dirname + "/public",
            to: path.resolve(__dirname, "../dist/public"),
          },
        ],
      }),
      new ESLintPlugin(),
    ],
  };
};
