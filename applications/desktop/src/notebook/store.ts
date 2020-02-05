import { middlewares as coreMiddlewares, reducers } from "@nteract/core";
import { applyMiddleware, combineReducers, createStore, Middleware, Store } from "redux";
import { ActionsObservable, combineEpics, createEpicMiddleware, StateObservable } from "redux-observable";
import { Observable } from "rxjs";
import { catchError } from "rxjs/operators";

import { Actions } from "./actions";
import epics from "./epics";
import { LocalContentProvider } from "./local-content-provider";
import { handleDesktopNotebook } from "./reducers";
import { DesktopNotebookAppState } from "./state";

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

const localContentProvider = new LocalContentProvider();
const epicMiddleware = createEpicMiddleware<
  Actions,
  Actions,
  DesktopNotebookAppState,
  any
>({ 
  dependencies: { contentProvider: localContentProvider } 
});
const middlewares: Middleware[] = [epicMiddleware];

export type DesktopStore = Store<DesktopNotebookAppState, Actions>;

if (process.env.DEBUG === "true") {
  middlewares.push(coreMiddlewares.logger());
}

const rootReducer = combineReducers({
  app: reducers.app,
  comms: reducers.comms,
  config: reducers.config,
  core: reducers.core,
  mythic: reducers.mythic,
  desktopNotebook: handleDesktopNotebook,
});

export default function configureStore(
  initialState: Partial<DesktopNotebookAppState>
): DesktopStore {
  const store = createStore(
    rootReducer,
    (initialState as unknown) as any,
    applyMiddleware(...middlewares)
  );
  epicMiddleware.run(rootEpic);

  return store as DesktopStore;
}
