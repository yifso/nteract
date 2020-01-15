// tslint:disable:max-line-length
import { System as NotificationSystem } from "react-notification-system";
import { Action, ErrorAction, makeActionFunction, makeErrorActionFunction, makeOneArgActionFunction } from "../utils";

export const OPEN_MODAL                   = "CORE/OPEN_MODAL";
export const CLOSE_MODAL                  = "CORE/CLOSE_MODAL";
export const SET_NOTIFICATION_SYSTEM      = "SET_NOTIFICATION_SYSTEM";
export const SET_GITHUB_TOKEN             = "SET_GITHUB_TOKEN";
export const ADD_TRANSFORM                = "ADD_TRANSFORM";
export const REMOVE_TRANSFORM             = "REMOVE_TRANSFORM";
export const ERROR                        = "CORE/ERROR";

export type OpenModal                     = Action     <typeof OPEN_MODAL,              { modalType: string }>;
export type CloseModal                    = Action     <typeof CLOSE_MODAL>;
export type SetNotificationSystemAction   = Action     <typeof SET_NOTIFICATION_SYSTEM, { notificationSystem: NotificationSystem }>;
export type SetGithubTokenAction          = Action     <typeof SET_GITHUB_TOKEN,        { githubToken: string }>;
export type AddTransform                  = Action     <typeof ADD_TRANSFORM,           { mediaType: string; component: any }>;
export type RemoveTransform               = Action     <typeof REMOVE_TRANSFORM,        { mediaType: string; component: any }>;
export type CoreError                     = ErrorAction<typeof ERROR>;

export const openModal                    = makeActionFunction      <OpenModal>                   (OPEN_MODAL);
export const closeModal                   = makeActionFunction      <CloseModal>                  (CLOSE_MODAL);
export const setNotificationSystem        = makeOneArgActionFunction<SetNotificationSystemAction> (SET_NOTIFICATION_SYSTEM)("notificationSystem");
export const setGithubToken               = makeOneArgActionFunction<SetGithubTokenAction>        (SET_GITHUB_TOKEN)       ("githubToken");
export const addTransform                 = makeActionFunction      <AddTransform>                (ADD_TRANSFORM);
export const removeTransform              = makeActionFunction      <RemoveTransform>             (REMOVE_TRANSFORM);
export const coreError                    = makeErrorActionFunction <CoreError>                   (ERROR);
