/**
 * @module epics
 */

// Vendor modules
import * as actions from "@nteract/actions";
import * as selectors from "@nteract/selectors";
import { AppState } from "@nteract/types";
import { ofType } from "redux-observable";
import { ActionsObservable, StateObservable } from "redux-observable";
import { contents, ServerConfig } from "rx-jupyter";
import { empty, of } from "rxjs";
import { AjaxResponse } from "rxjs/ajax";
import { catchError, map, switchMap, tap } from "rxjs/operators";

export function publishToBookstore(
  action$: ActionsObservable<actions.PublishToBookstore>,
  state$: StateObservable<AppState>
) {
  return action$.pipe(
    ofType(actions.PUBLISH_TO_BOOKSTORE),
    switchMap(action => {
      if (!action.payload) {
        return of({
          type: "ERROR",
          error: true,
          payload: {
            error: new Error("saving content to Bookstore needs a payload")
          }
        }) as any;
      }

      const bookstoreEndpoint: string = "api/bookstore/published";
      const state: any = state$.value;
      const host: any = selectors.currentHost(state);

      // Dismiss any usage that isn't targeting a jupyter server
      if (host.type !== "jupyter") {
        return empty();
      }

      const content: any = selectors.contentByRef(state);
      const serverConfig: ServerConfig = selectors.serverConfig(host);

      return contents.create(serverConfig, bookstoreEndpoint, content).pipe(
        tap((xhr: AjaxResponse) => {
          if (xhr.status !== 200) {
            throw new Error(xhr.response);
          }
        }),
        map(() => {
          actions.publishToBookstoreSucceeded({
            contentRef: action.payload.contentRef
          });
        }),
        catchError((xhrError: any) =>
          of(
            actions.publishToBookstoreFailed({
              error: xhrError,
              contentRef: action.payload.contentRef
            })
          )
        )
      );
    })
  );
}
