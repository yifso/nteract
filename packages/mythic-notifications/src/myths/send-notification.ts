import { filter, map } from "rxjs/operators";
import { notifications } from "../package";
import { NotificationMessage } from "../types";

export const sendNotification =
  notifications.createMyth("sendNotification")<NotificationMessage>({
    reduce: (state, action) =>
      state.current.addNotification(action.payload),

    createOn: (action$) =>
      action$.pipe(
        filter(each => !!(each as any).error),
        map(action => ({
          title: action.type,
          message:
            (action as any)?.payload?.error?.message
            ?? JSON.stringify((action as any)?.payload ?? action, null, 2),
          level: "error",
        })),
      ),
  });
