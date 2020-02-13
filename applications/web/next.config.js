const configurator = require("@nteract/webpack-configurator");
const withTM = require("next-transpile-modules");
const withCSS = require("@zeit/next-css");

module.exports = withCSS(
  withTM({
    transpileModules: Object.keys(configurator.aliases),
    webpack: (config, { isServer }) => {
      // Fixes npm packages that depend on `fs` module
      if (!isServer) {
        config.node = {
          fs: "empty"
        };
      }
      const { module = {} } = config;
      config = {
        ...config,
        externals: ["canvas", ...(config.externals || [])],
        module: {
          ...module,
          rules: [
            ...(module.rules || []),
            {
              test: /\.(jpg|png|gif)$/,
              use: "file-loader"
            },
            {
              test: /\.(jpe?g|png|ttf|eot|svg|woff?)(\?[a-z0-9=&.]+)?$/,
              use: "base64-inline-loader"
            }
          ]
        }
      };

      return config;
    }
  })
);
