import { Callout, Intent, Toaster } from "@blueprintjs/core";
import React from "react";
import { NotificationMessage, NotificationSystem } from "../types";


export const blueprintjsNotificationSystem =
  (toaster: Toaster): NotificationSystem => ({
    addNotification: (msg: NotificationMessage) => {
      const intent = ({
        warning: Intent.WARNING,
        error: Intent.DANGER
      } as any)[msg.level ?? "info"] ?? Intent.PRIMARY;

      toaster.show({
        message: (
          <Callout title={msg.title} intent={intent}>
            {msg.message}
          </Callout>
        ),
        action: msg.action
          ? { text: msg.action.label, onClick: msg.action.callback }
          : undefined,
        timeout: msg.action
          ? 0
          : 10_000,
      }, msg.key);
    },
  });
