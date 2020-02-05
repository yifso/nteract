import { RecordOf } from "immutable";
import { filter, map } from "rxjs/operators";

import { createMyth } from "../external/myths";
import { NotificationMessage, NotificationsProps } from "../types";


export const sendNotification = createMyth(
  "notifications",
  "sendNotification",
  "NOTIFICATIONS/SEND_NOTIFICATION",
)<NotificationMessage, RecordOf<NotificationsProps>>({
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
        dismissible: true,
        position: "tr",
        level: "error",
      })),
    ),
});
