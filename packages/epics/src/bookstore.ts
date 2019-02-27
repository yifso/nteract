/**
 * @module epics
 */
import { ofType } from "redux-observable";
import { ActionsObservable } from "redux-observable";
import { contents, ServerConfig } from "rx-jupyter";
import { empty, of } from "rxjs";
import { AjaxResponse } from "rxjs/ajax";
import { catchError, map, switchMap, tap } from "rxjs/operators";

import * as actions from "@nteract/actions";
import * as selectors from "@nteract/selectors";

export const fetchBookstoreValidationEpic = (
  action$: ActionsObservable<actions.FetchBookstoreValidation>,
  state$: any
) =>
  action$.pipe(
    ofType(actions.FETCH_BOOKSTORE_VALIDATION),
    switchMap(() => {
      const state: any = state$.value;
      const host: any = selectors.currentHost(state);

      // Dismiss any usage that isn't targeting a jupyter server
      if (host.type !== "jupyter") {
        return empty();
      }

      const serverConfig: ServerConfig = selectors.serverConfig(host);

      return contents.get(serverConfig, "api/bookstore/", {}).pipe(
        tap((xhr: AjaxResponse) => {
          if (xhr.status !== 200) {
            throw new Error(xhr.response);
          }
        }),
        map((xhr: AjaxResponse) => {
          // Grab bookstore payload and send it with
          // fetchBookstoreValidationSuccess.
          // Reduce the state in the reducer
          actions.fetchBookstoreValidationSuccess({
            bookstore: xhr.response
          });
        }),
        catchError((xhrError: any) =>
          of(
            actions.fetchBookstoreValidationFailed({
              error: xhrError
            })
          )
        )
      );
    })
  );
