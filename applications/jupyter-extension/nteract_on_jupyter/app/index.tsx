import {
  actions,
  createContentRef,
  createHostRef,
  createKernelRef,
  createKernelspecsRef,
  makeAppRecord,
  makeCommsRecord,
  makeContentsRecord,
  makeDummyContentRecord,
  makeEntitiesRecord,
  makeHostsRecord,
  makeJupyterHostRecord,
  makeStateRecord,
  makeTransformsRecord
} from "@nteract/core";
import { AppState } from "@nteract/core";
import { ContentRecord, HostRecord } from "@nteract/types";

import { WidgetDisplay } from "@nteract/jupyter-widgets";
import DataResourceTransform from "@nteract/transform-dataresource";
import GeoJSONTransform from "@nteract/transform-geojson";
import ModelDebug from "@nteract/transform-model-debug";
import PlotlyTransform, {
  PlotlyNullTransform
} from "@nteract/transform-plotly";
import VDOMDisplay from "@nteract/transform-vdom";
import { Vega2, Vega3, VegaLite1, VegaLite2 } from "@nteract/transform-vega";

import * as Immutable from "immutable";
import * as React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

import App from "./app";
import configureStore from "./store";

const urljoin = require("url-join");

require("./fonts");

export interface JupyterConfigData {
  token: string;
  page: "tree" | "view" | "edit";
  contentsPath: string;
  baseUrl: string;
  appVersion: string;
  assetUrl: string;
}

function main(rootEl: Element, dataEl: Node | null) {
  // When the data element isn't there, provide an error message
  // Primarily for development usage
  const ErrorPage = (props: { error?: Error }) => (
    <React.Fragment>
      <h1>ERROR</h1>
      <pre>Unable to parse / process the jupyter config data.</pre>
      {props.error ? props.error.message : null}
    </React.Fragment>
  );

  if (!dataEl) {
    ReactDOM.render(<ErrorPage />, rootEl);
    return;
  }

  let config: JupyterConfigData;

  try {
    if (!dataEl.textContent) {
      throw new Error("Unable to find Jupyter config data.");
    }
    config = JSON.parse(dataEl.textContent);
  } catch (err) {
    ReactDOM.render(<ErrorPage error={err} />, rootEl);
    return;
  }

  // Allow chunks from webpack to load from their built location
  __webpack_public_path__ = urljoin(config.assetUrl, "nteract/static/dist/");

  const jupyterHostRecord = makeJupyterHostRecord({
    id: null,
    type: "jupyter",
    defaultKernelName: "python",
    token: config.token,
    origin: location.origin,
    basePath: config.baseUrl
  });

  const hostRef = createHostRef();
  const contentRef = createContentRef();
  const NullTransform = () => null;

  const initialState: AppState = {
    app: makeAppRecord({
      version: `nteract-on-jupyter@${config.appVersion}`,
      // TODO: Move into core as a "current" host
      host: jupyterHostRecord
    }),
    comms: makeCommsRecord(),
    config: Immutable.Map({
      theme: "light"
    }),
    core: makeStateRecord({
      entities: makeEntitiesRecord({
        hosts: makeHostsRecord({
          byRef: Immutable.Map<string, HostRecord>().set(
            hostRef,
            jupyterHostRecord
          )
        }),
        contents: makeContentsRecord({
          byRef: Immutable.Map<string, ContentRecord>().set(
            contentRef,
            makeDummyContentRecord({
              filepath: config.contentsPath
            })
          )
        }),
        transforms: makeTransformsRecord({
          handlers: Immutable.List([
            NullTransform,
            NullTransform,
            NullTransform,
            NullTransform,
            NullTransform,
            NullTransform,
            NullTransform,
            NullTransform,
            NullTransform,
            NullTransform
          ]),
          displayOrder: Immutable.List([
            "application/vnd.jupyter.widget-view+json",
            "application/vnd.vega.v3+json",
            "application/vnd.vega.v2+json",
            "application/vnd.vegalite.v2+json",
            "application/vnd.vegalite.v1+json",
            "application/geo+json",
            "application/vnd.plotly.v1+json",
            "text/vnd.plotly.v1+html",
            "application/x-nteract-model-debug+json",
            "application/vnd.dataresource+json",
            "application/vdom.v1+json",
            "application/json",
            "application/javascript",
            "text/html",
            "text/markdown",
            "text/latex",
            "image/svg+xml",
            "image/gif",
            "image/png",
            "image/jpeg",
            "text/plain"
          ]),
          byId: Immutable.Map({
            [PlotlyTransform.MIMETYPE]: NullTransform,
            [GeoJSONTransform.MIMETYPE]: NullTransform,
            [ModelDebug.MIMETYPE]: NullTransform,
            [DataResourceTransform.MIMETYPE]: NullTransform,
            [VegaLite1.MIMETYPE]: NullTransform,
            [VegaLite2.MIMETYPE]: NullTransform,
            [Vega2.MIMETYPE]: NullTransform,
            [Vega3.MIMETYPE]: NullTransform,
            [VDOMDisplay.MIMETYPE]: NullTransform,
            [WidgetDisplay.MIMETYPE]: NullTransform
          })
        })
      })
    })
  };

  const kernelRef = createKernelRef();
  const kernelspecsRef = createKernelspecsRef();

  const store = configureStore(initialState);
  (window as any).store = store;

  store.dispatch(
    actions.fetchContent({
      filepath: config.contentsPath,
      params: {},
      kernelRef,
      contentRef
    })
  );
  store.dispatch(actions.fetchKernelspecs({ hostRef, kernelspecsRef }));

  ReactDOM.render(
    <Provider store={store}>
      <App contentRef={contentRef} />
    </Provider>,
    rootEl
  );
}

const rootEl = document.querySelector("#root");
const dataEl = document.querySelector("#jupyter-config-data");

if (!rootEl || !dataEl) {
  alert("Something drastic happened, and we don't have config data");
} else {
  main(rootEl, dataEl);
}
