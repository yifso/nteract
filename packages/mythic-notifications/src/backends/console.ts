import { NotificationMessage, NotificationSystem } from "../types";

export const consoleNotificationSystem: NotificationSystem = {
  addNotification: (msg: NotificationMessage) => {
    let logger = console.log.bind(console);
    switch (msg.level) {
      case "error":
        logger = console.error.bind(console);
        break;
      case "warning":
        logger = console.warn.bind(console);
        break;
    }
    logger(msg);
  }
};
