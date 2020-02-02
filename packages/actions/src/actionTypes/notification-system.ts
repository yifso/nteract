// tslint:disable:max-line-length
import { NotificationSystem } from "@nteract/types";
import { Action, makeOneArgActionFunction } from "../utils";

export const SET_NOTIFICATION_SYSTEM      = "SET_NOTIFICATION_SYSTEM";

export type SetNotificationSystemAction   = Action     <typeof SET_NOTIFICATION_SYSTEM, { notificationSystem: NotificationSystem }>;

export const setNotificationSystem        = makeOneArgActionFunction<SetNotificationSystemAction> (SET_NOTIFICATION_SYSTEM)("notificationSystem");
