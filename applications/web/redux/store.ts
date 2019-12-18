import {
  AppState,
  ContentRecord,
  createKernelspecsRef,
  HostRecord,
  makeAppRecord,
  makeCommsRecord,
  makeContentsRecord,
  makeEntitiesRecord,
  makeHostsRecord,
  makeStateRecord,
  makeTransformsRecord
} from "@nteract/core";
import { epics as coreEpics, reducers } from "@nteract/core";
import { Media } from "@nteract/outputs";
import TransformVDOM from "@nteract/transform-vdom";
import { applyMiddleware, combineReducers, compose, createStore } from "redux";
import {
  ActionsObservable,
  combineEpics,
  createEpicMiddleware,
  Epic,
  StateObservable
} from "redux-observable";
import { Observable } from "rxjs";
import { catchError } from "rxjs/operators";

import Immutable from "immutable";

const packageJson = require("../package.json");

const rootReducer = combineReducers({
  app: reducers.app,
  comms: reducers.comms,
  config: reducers.config,
  core: reducers.core
});

const NullTransform = () => null;
const kernelspecsRef = createKernelspecsRef();

const initialState: AppState = {
  app: makeAppRecord({
    version: `nteract-on-web@${packageJson.version}`
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
          "application/vdom.v1+json": TransformVDOM,
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

export default function configureStore() {
  const rootEpic = (
    action$: ActionsObservable<any>,
    store$: StateObservable<any>,
    dependencies: any
  ) =>
    combineEpics<Epic>(...coreEpics.allEpics)(
      action$,
      store$,
      dependencies
    ).pipe(
      catchError((error: any, source: Observable<any>) => {
        console.error(error);
        return source;
      })
    );
  const epicMiddleware = createEpicMiddleware();
  const middlewares = [epicMiddleware];

  const store = createStore(
    rootReducer,
    (initialState as unknown) as any,
    applyMiddleware(...middlewares)
  );

  epicMiddleware.run(rootEpic);

  return store;
}
