import { AnyAction } from "redux";
import { ActionsObservable, ofType, StateObservable } from "redux-observable";
import { binder } from "rx-binder";
import * as actions from "./actions";

import {
  actions as nteractActions,
  AppState,
  createContentRef,
  createHostRef,
  createKernelRef,
  createKernelspecsRef,
  makeJupyterHostRecord,
  selectors
} from "@nteract/core";

import { empty, of } from "rxjs";

import {
  catchError,
  filter,
  mergeMap,
  switchMap,
  withLatestFrom
} from "rxjs/operators";

export const launchServerEpic = (
  action$: ActionsObservable<AnyAction>,
  state$: StateObservable<AppState>
) =>
  action$.pipe(
    ofType(actions.LAUNCH_SERVER),
    // Definitely do not run this on the server side
    filter(() => typeof window !== "undefined"),
    withLatestFrom(state$),
    switchMap(([, state]) => {
      const repo = state.webApp.get("repo");
      const gitref = state.webApp.get("gitRef");

      return binder({ repo, gitref }, EventSource).pipe(
        mergeMap(message => {
          const actionsArray = [];
          actionsArray.push(actions.addServerMsg({ message }));
          if (message.phase === "ready") {
            const hostRef = createHostRef();
            const config = {
              origin: message.url.replace(/\/\s*$/, ""),
              basePath: "/",
              token: message.token,
              crossDomain: true,
              id: hostRef
            };
            actionsArray.push(
              nteractActions.setAppHost(makeJupyterHostRecord(config))
            );
            const kernelspecsRef = createKernelspecsRef();
            actionsArray.push(
              nteractActions.fetchKernelspecs({ hostRef, kernelspecsRef })
            );
            const contentRef = createContentRef();
            actionsArray.push(
              nteractActions.fetchContent({
                contentRef,
                filepath: "/"
              })
            );
          }
          return of(...actionsArray);
        }),
        catchError(error => of({ type: "error", payload: { serverId, error } }))
      );
    })
  );

export const loadActiveFile = (
  action$: ActionsObservable<AnyAction>,
  state$: StateObservable<AppState>
) =>
  action$.pipe(
    ofType(actions.SET_FILE),
    filter(() => typeof window !== "undefined"),
    withLatestFrom(state$),
    switchMap(([action, state]) => {
      const contentRef = selectors.contentRefByFilepath(state, {
        filepath: action.payload.contentRef
      });
      const content = selectors.content(state, { contentRef });
      if (!contentRef || content.type === "dummy") {
        return of(
          nteractActions.fetchContent({
            filepath: action.payload.contentRef,
            contentRef: contentRef ? contentRef : createContentRef(),
            kernelRef: createKernelRef()
          })
        );
      }
      return empty();
    })
  );

export default [loadActiveFile, launchServerEpic];
