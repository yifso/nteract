module.exports = {
  name: "nteract",
  mode: "modules",
  out: "nteract-packages/dist",
  theme: "default",
  ignoreCompilerErrors: "true",
  preserveConstEnums: "true",
  exclude: [
    "*.spec.ts",
    "*.test.ts",
    "**/node_modules/**",
    "**/__tests__/**",
    "**/packages/vega-embed2/**",
    "*.js"
  ],
  externalPattern: "**/node_modules/**",
  excludeExternals: "true",
  stripInternal: "false",
  tsconfig: "tsconfig.base.json"
};
