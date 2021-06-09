const merge = require("webpack-merge");

const { commonMainConfig, commonRendererConfig } = require("./webpack.common");

const mainConfig = merge.merge(commonMainConfig, { mode: "production" });

const rendererConfig = merge.merge(commonRendererConfig, {
  mode: "production",
});

module.exports = [mainConfig, rendererConfig];
