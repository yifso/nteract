import { default as Immutable } from "immutable";
import React from "react";
import { consoleNotificationSystem } from "./backends/console";

export interface NotificationMessage {
  title?: string | JSX.Element;
  message?: string | JSX.Element;
  level?: "error" | "warning" | "info" | "success";
  position?: "tr" | "tl" | "tc" | "br" | "bl" | "bc";
  autoDismiss?: number;
  dismissible?: boolean;
  action?: {
    label: string;
    callback?: () => void;
  };
  children?: React.ReactNode;
  onAdd?: (notification: NotificationMessage) => void;
  onRemove?: (notification: NotificationMessage) => void;
  uid?: number | string;
}

export interface NotificationSystem {
  addNotification(notification: NotificationMessage): void;
}

export interface NotificationsProps {
  current: NotificationSystem;
}

export const makeNotificationsRecord =
  Immutable.Record<NotificationsProps>({
    current: consoleNotificationSystem,
  });
