import { MythicAction } from "@nteract/myths";
import { notifications } from "../package";
import { NotificationMessage } from "../types";

const titleFromAction = (action: MythicAction) => {
  const text = action.type
    .replace(/.*\//, "")
    .replace(/([a-z])([A-Z])/g, (...x: string[]) => `${x[1]} ${x[2]}`)
    .replace(/_/g, " ");
  return (
    text.charAt(0).toUpperCase() +
    text.substr(1).toLowerCase()
  );
};

const messageFromAction = (action: MythicAction) =>
  (action as any)?.payload?.error?.message
  ?? JSON.stringify((action as any)?.payload ?? action, null, 2);

export const sendNotification =
  notifications.createMyth("sendNotification")<NotificationMessage>({
    reduce: (state, action) =>
      state.current.addNotification(action.payload),

    epics: [
      {
        on: action => action.error ?? false,
        create: action => ({
          title: titleFromAction(action),
          message: messageFromAction(action),
          level: "error",
        }),
      },
    ],
  });
