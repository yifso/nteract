import { RecordOf } from "immutable";
import { createMyth } from "../external/myths";
import { NotificationMessage, NotificationsProps } from "../types";


export const sendNotification = createMyth(
  "notifications",
  "NOTIFICATIONS/SEND_NOTIFICATION",
)<NotificationMessage, RecordOf<NotificationsProps>>({
  reduce: (state, action) => {
    state.current.addNotification(action.payload);
    return state;
  },
});
