import Immutable from "immutable";
import { compose } from "redux";

import {
  AppState,
  epics as coreEpics,
  reducers,
  makeAppRecord,
  makeCommsRecord,
  makeStateRecord,
  makeEntitiesRecord,
  makeHostsRecord,
  makeTransformsRecord,
  HostRecord,
  ContentRecord,
  makeContentsRecord,
  createKernelspecsRef
} from "@nteract/core";
import { notifications } from "@nteract/mythic-notifications";
import { makeConfigureStore } from "@nteract/myths";
import { Media } from "@nteract/outputs";
import { contents } from "rx-jupyter";

const NullTransform = () => null;
const kernelspecsRef = createKernelspecsRef();

const composeEnhancers =
  typeof window !== "undefined"
    ? (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    : compose;

export const initialState: AppState = {
  app: makeAppRecord({
    version: `@nteract/web`
  }),
  comms: makeCommsRecord(),
  config: Immutable.Map({
    theme: "light"
  }),
  core: makeStateRecord({
    currentKernelspecsRef: kernelspecsRef,
    entities: makeEntitiesRecord({
      hosts: makeHostsRecord({
        byRef: Immutable.Map<string, HostRecord>()
      }),
      contents: makeContentsRecord({
        byRef: Immutable.Map<string, ContentRecord>()
      }),
      transforms: makeTransformsRecord({
        displayOrder: Immutable.List([
          "application/vnd.jupyter.widget-view+json",
          "application/vnd.vega.v5+json",
          "application/vnd.vega.v4+json",
          "application/vnd.vega.v3+json",
          "application/vnd.vega.v2+json",
          "application/vnd.vegalite.v3+json",
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
          "text/vnd.plotly.v1+html": NullTransform,
          "application/vnd.plotly.v1+json": NullTransform,
          "application/geo+json": NullTransform,
          "application/x-nteract-model-debug+json": NullTransform,
          "application/vnd.dataresource+json": NullTransform,
          "application/vnd.jupyter.widget-view+json": NullTransform,
          "application/vnd.vegalite.v1+json": NullTransform,
          "application/vnd.vegalite.v2+json": NullTransform,
          "application/vnd.vegalite.v3+json": NullTransform,
          "application/vnd.vega.v2+json": NullTransform,
          "application/vnd.vega.v3+json": NullTransform,
          "application/vnd.vega.v4+json": NullTransform,
          "application/vnd.vega.v5+json": NullTransform,
          "application/vdom.v1+json": NullTransform,
          "application/json": Media.Json,
          "application/javascript": Media.JavaScript,
          "text/html": Media.HTML,
          "text/markdown": Media.Markdown,
          "text/latex": Media.LaTeX,
          "image/svg+xml": Media.SVG,
          "image/gif": Media.Image,
          "image/png": Media.Image,
          "image/jpeg": Media.Image,
          "text/plain": Media.Plain
        })
      })
    })
  })
};

const configureStore = makeConfigureStore<AppState>()({
  packages: [notifications],
  reducers: {
    app: reducers.app,
    comms: reducers.comms,
    config: reducers.config,
    core: reducers.core as any
  },
  epics: coreEpics.allEpics,
  epicDependencies: { contentProvider: contents.JupyterContentProvider },
  enhancer: composeEnhancers
});

export default () => configureStore(initialState);
