const configurator = require("@nteract/webpack-configurator");
const withTM = require("next-transpile-modules");

module.exports = withTM({
  transpileModules: Object.keys(configurator.aliases),
  webpack: configurator.nextWebpack
});
