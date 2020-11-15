import { notifications } from "../package";
import { NotificationSystem } from "../types";

export const initializeSystem =
  notifications.createMyth("initializeSystem")<NotificationSystem>({
    reduce: (state, action) =>
      state.set("current", action.payload)
  });
