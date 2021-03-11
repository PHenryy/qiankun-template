const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
// const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const ESLintPlugin = require("eslint-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const processEnv = require("./prod.env");

module.exports = (env) => {
  return {
    mode: env.NODE_ENV,
    entry: {
      index: "./src/index.js",
    },
    output: {
      filename: "js/[name].[contenthash].js",
      path: path.resolve(__dirname, "./dist"),
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
          // Please don't 'style-loader' and mini-css-extract-loader together
          // https://github.com/webpack-contrib/mini-css-extract-plugin/issues/613#issuecomment-707653736
          use: [MiniCssExtractPlugin.loader, "css-loader"],
        },
      ],
    },
    plugins: [
      // new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        template: "index.html",
        templateParameters: {
          LIB_COMMON: processEnv.LIB_COMMON,
        },
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: __dirname + "/public",
            to: path.resolve(__dirname, "./dist/public"),
          },
        ],
      }),
      new ESLintPlugin(),
      new MiniCssExtractPlugin({
        filename: "css/[name]",
      }),
      new BundleAnalyzerPlugin({
        openAnalyzer: false,
      }),
    ],
    optimization: {
      runtimeChunk: "single",
      splitChunks: {
        chunks: "all",
        maxInitialRequests: Infinity,
        minSize: 0,
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name(module) {
              // get the name. E.g. node_modules/packageName/not/this/part.js
              // or node_modules/packageName
              const packageName = module.context.match(
                /[\\/]node_modules[\\/](.*?)([\\/]|$)/
              )[1];

              // npm package names are URL-safe, but some servers don't like @ symbols
              return `npm.${packageName.replace("@", "")}`;
            },
          },
        },
      },
    },
  };
};
