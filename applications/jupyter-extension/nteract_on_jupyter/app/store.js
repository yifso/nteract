/* @flow strict */
import { combineReducers, createStore, applyMiddleware, compose } from "redux";
import { createEpicMiddleware, combineEpics } from "redux-observable";
import type { AppState } from "@nteract/core";
import { reducers, epics as coreEpics, middlewares as coreMiddlewares } from "@nteract/core";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const rootReducer = combineReducers({
  app: reducers.app,
  comms: reducers.comms,
  config: reducers.config,
  core: reducers.core
});

export default function configureStore(initialState: AppState) {
  const rootEpic = combineEpics<AppState, redux$AnyAction, *>(
    ...coreEpics.allEpics
  );
  const epicMiddleware = createEpicMiddleware();
  const middlewares = [epicMiddleware, coreMiddlewares.errorMiddleware];

  const store = createStore(
    rootReducer,
    initialState,
    composeEnhancers(applyMiddleware(...middlewares))
  );

  epicMiddleware.run(rootEpic);

  return store;
}
