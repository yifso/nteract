import { ErrorAction } from "@nteract/actions";
import { sendNotification } from "@nteract/mythic-notifications";
import { Action } from "redux";
import { ActionsObservable } from "redux-observable";
import { of } from "rxjs";
import { filter, map } from "rxjs/operators";

/**
 * An epic that emits notifications upon errors
 * @param  {ActionsObservable} action$ Action Observable from redux-observable
 * @return {ActionsObservable}         Notifications
 */
export const errorNotificationEpic = (
  action$: ActionsObservable<Action | ErrorAction<any, any>>,
) =>
  action$.pipe(
    filter(each => "error" in each && each.error),
    map(action => {
      let errorText;
      const errorAction = action as ErrorAction<any, any>;

      if (errorAction.payload) {
        if (
          errorAction.payload instanceof Object &&
          errorAction.payload.error instanceof Error
        ) {
          errorText = errorAction.payload.error.message;
        } else {
          errorText = JSON.stringify(errorAction.payload, null, 2);
        }
      } else {
        errorText = JSON.stringify(errorAction, null, 2);
      }

      return of(
        sendNotification.create({
          title: errorAction.type,
          message: errorText,
          dismissible: true,
          position: "tr",
          level: "error",
        }),
      );
    })
  );
