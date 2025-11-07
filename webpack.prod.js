import { merge } from "webpack-merge";
import commonConfig from "./webpack.common.js";
import MiniCssExtractPlugin from "mini-css-extract-plugin";

export default merge(commonConfig, {
  mode: "production",
  devtool: "source-map",
  output: {
    filename: "bundle.[contenthash].js",
    assetModuleFilename: "assets/[hash][ext][query]",
    publicPath: "/",
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].[contenthash].css",
    }),
  ],
});
