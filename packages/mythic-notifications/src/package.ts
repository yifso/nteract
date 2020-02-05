import { consoleNotificationSystem } from "./backends/console";
import { createMythicPackage } from "./external/myths";
import { NotificationSystem } from "./types";

export const notifications = createMythicPackage(
  "notifications"
)<{
  current: NotificationSystem;
}>({
  initialState: {
    current: consoleNotificationSystem,
  },
});
