import { createStore, applyMiddleware, combineReducers, Store } from "redux";
import { createEpicMiddleware, combineEpics } from "redux-observable";
import { middlewares as coreMiddlewares, reducers } from "@nteract/core";

import { DesktopNotebookAppState } from "./state";
import { handleDesktopNotebook } from "./reducers";
import epics from "./epics";
import { Actions } from "./actions";

const rootEpic = combineEpics(...epics);
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
  initialState: DesktopNotebookAppState
): DesktopStore {
  const store = createStore(
    rootReducer,
    initialState,
    applyMiddleware(...middlewares)
  );
  epicMiddleware.run(rootEpic);
  return store as DesktopStore;
}
