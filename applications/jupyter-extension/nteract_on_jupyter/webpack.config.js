const configurator = require("@nteract/webpack-configurator");
const LodashModuleReplacementPlugin = require("lodash-webpack-plugin");
const webpack = require("webpack");
const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");

const nodeEnv = process.env.NODE_ENV || "development";
const isProd = nodeEnv === "production";

const ASSET_PATH = process.env.ASSET_PATH || "/nteract/static/dist";

module.exports = {
  externals: ["canvas"],
  mode: isProd ? "production" : "development",
  devtool: isProd ? "hidden-source-map" : "cheap-eval-source-map",
  entry: {
    app: "./app/index.tsx"
  },
  devServer: isProd
    ? {}
    : {
        hot: true,
        headers: { "Access-Control-Allow-Origin": "*" }
      },
  target: "web",
  output: {
    // Note: this gets overriden by our use of __webpack_public_path__ later
    // to allow serving the notebook at e.g. /user/c/nteract/edit
    publicPath: ASSET_PATH,
    chunkFilename: "[name]-[chunkhash].bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.tsx?$/,
        use: [configurator.tsLoaderConfig]
      }
    ]
  },
  resolve: {
    mainFields: ["nteractDesktop", "module", "main"],
    extensions: [".ts", ".tsx", ".js"],
    alias: configurator.mergeDefaultAliases()
  },
  plugins: [
    new LodashModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      "process.env.ASSET_PATH": JSON.stringify(ASSET_PATH)
    }),
    //new webpack.IgnorePlugin(/\.(css|less)$/),
    new MonacoWebpackPlugin(),

    new webpack.IgnorePlugin(
      /^((fs)|(path)|(os)|(crypto)|(source-map-support))$/,
      /vs\/language\/typescript\/lib/
    )
  ]
};
