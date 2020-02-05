export interface NotificationMessage {
  key?: string;
  title?: string;
  message: string | JSX.Element;
  level: "error" | "warning" | "info" | "success";
  action?: {
    label: string;
    callback: () => void;
  };
}

export interface NotificationSystem {
  addNotification(notification: NotificationMessage): void;
}
