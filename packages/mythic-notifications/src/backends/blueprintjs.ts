import { Intent, Toaster } from "@blueprintjs/core";
import { NotificationMessage, NotificationSystem } from "../types";


export const blueprintjsNotificationSystem =
  (toaster: Toaster): NotificationSystem => ({
    addNotification: (msg: NotificationMessage) => {
      toaster.show({
        message: `${msg.title ?? ""} ${msg.message ?? ""}`,
        intent: ({
          warning: Intent.WARNING,
          error: Intent.DANGER
        } as any)[msg.level ?? "info"] ?? Intent.PRIMARY
      });
    },
  });
