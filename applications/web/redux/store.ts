import {
  epics as coreEpics,
  middlewares as coreMiddlewares,
  reducers
} from "@nteract/core";
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

import webAppReducers from "./reducers";

import Immutable from "immutable";

// Vendor modules
import {
  AppState,
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
import { Media } from "@nteract/outputs";
import TransformVDOM from "@nteract/transform-vdom";
import { ContentRecord, HostRecord } from "@nteract/types";

import epics from "./epics";

const composeEnhancers =
  typeof window !== "undefined"
    ? (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    : compose;

const NullTransform = () => null;

const initialState: AppState = {
  app: makeAppRecord({
    version: "nteract-on-web",
    host: makeJupyterHostRecord({})
  }),
  comms: makeCommsRecord(),
  config: Immutable.Map({
    theme: "light"
  }),
  core: makeStateRecord({
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

const rootReducer = combineReducers({
  app: reducers.app,
  comms: reducers.comms,
  config: reducers.config,
  core: reducers.core,
  webApp: webAppReducers
});

export default function configureStore() {
  const rootEpic = (
    action$: ActionsObservable<any>,
    store$: StateObservable<any>,
    dependencies: any
  ) =>
    combineEpics<Epic>(...coreEpics.allEpics, ...epics)(
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
  const middlewares = [epicMiddleware, coreMiddlewares.errorMiddleware];

  const store = createStore(
    rootReducer,
    (initialState as unknown) as any,
    composeEnhancers(applyMiddleware(...middlewares))
  );

  epicMiddleware.run(rootEpic);

  return store;
}
