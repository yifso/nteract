import { middlewares as coreMiddlewares, reducers } from "@nteract/core";
import { applyMiddleware, combineReducers, createStore, Store, compose } from "redux";
import {
  combineEpics,
  createEpicMiddleware,
  ActionsObservable,
  StateObservable
} from "redux-observable";
import { catchError } from "rxjs/operators";

import { Actions } from "./actions";
import epics from "./epics";
import { handleDesktopNotebook } from "./reducers";
import { DesktopNotebookAppState } from "./state";
import { Observable } from "rxjs";

const rootEpic = (
  action$: ActionsObservable<any>,
  store$: StateObservable<any>,
  dependencies: any
) =>
  combineEpics(...epics)(action$, store$, dependencies).pipe(
    catchError((error: any, source: Observable<any>) => {
      console.error(error);
      return source;
    })
  );

const epicMiddleware = createEpicMiddleware<
  Actions,
  Actions,
  DesktopNotebookAppState,
  any
>();
const middlewares = [epicMiddleware, coreMiddlewares.errorMiddleware];

export type DesktopStore = Store<DesktopNotebookAppState, Actions>;

if (process.env.DEBUG === "true") {
  middlewares.push(coreMiddlewares.logger());
}

const rootReducer = combineReducers({
  app: reducers.app,
  comms: reducers.comms,
  config: reducers.config,
  core: reducers.core,
  desktopNotebook: handleDesktopNotebook
});

export default function configureStore(
  initialState: Partial<DesktopNotebookAppState>
): DesktopStore {
  const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  const store = createStore(
    rootReducer,
    (initialState as unknown) as any,
    composeEnhancers(
      applyMiddleware(...middlewares)
    )
  );
  epicMiddleware.run(rootEpic);
  return store as DesktopStore;
}
