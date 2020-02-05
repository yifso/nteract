import { middlewares as coreMiddlewares } from "@nteract/core";
import { applyMiddleware, compose, createStore, Middleware, Store } from "redux";

import reducers, { MainAction, MainStateRecord } from "./reducers";

const middlewares: Middleware[] = [];

/* istanbul ignore if -- only used for debugging */
if (process.env.DEBUG === "true") {
  middlewares.push(coreMiddlewares.logger());
}

export default function configureStore(): Store<MainStateRecord, MainAction> {
  return createStore(reducers, compose(applyMiddleware(...middlewares)));
}
