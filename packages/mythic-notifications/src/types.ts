import { IconName } from "@blueprintjs/core";
import { MythicAction } from "@nteract/myths";


export type NotificationAction =
  | { callback: () => void }
  | { dispatch: MythicAction }
  | { url: string }
  | { file: string }
  ;

export interface NotificationMessage {
  key?: string;
  icon?: IconName;
  title?: string;
  message: string | JSX.Element;
  level: "error" | "warning" | "info" | "success" | "in-progress";
  action?: NotificationAction & {
    icon?: IconName;
    label: string;
  };
}

export interface NotificationSystem {
  addNotification(notification: NotificationMessage): void;
}
