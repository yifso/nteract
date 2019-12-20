const configurator = require("@nteract/webpack-configurator");
const withTM = require("next-transpile-modules");
const withCSS = require("@zeit/next-css");

module.exports = withCSS(
  withTM({
    transpileModules: Object.keys(configurator.aliases),
    webpack: configurator.nextWebpack
  })
);
