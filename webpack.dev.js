import { merge } from "webpack-merge";
import { fileURLToPath } from "url";
import commonConfig from "./webpack.common.js";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default merge(commonConfig, {
  mode: "development",
  devtool: "eval-source-map",
  output: {
    filename: "bundle.js",
    publicPath: "/",
  },
  devServer: {
    static: {
      directory: path.resolve(__dirname, "public"),
    },
    hot: true,
    port: 3000,
    historyApiFallback: true,
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
    ],
  },
});
