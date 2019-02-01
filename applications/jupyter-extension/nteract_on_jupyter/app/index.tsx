/**
 * Main entry point for the web notebook UI
 */

import { JupyterConfigData, readConfig } from "./config";

import urljoin from "url-join";

const rootEl = document.querySelector("#root");
const dataEl = document.querySelector("#jupyter-config-data");

if (!rootEl || !dataEl) {
  alert("Something drastic happened, and we don't have config data");
} else {
  const config: JupyterConfigData = readConfig(rootEl, dataEl);

  // Allow chunks from webpack to load from their built location
  // NOTE: This _must_ run synchronously before webpack tries to load other
  // chunks
  ((window as unknown) as any).__webpack_public_path__ = urljoin(
    config.assetUrl,
    "nteract/static/dist/"
  );

  import("./bootstrap").then(module => {
    module.main(config, rootEl);
  });
}
