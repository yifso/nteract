import { makeAppRecord } from "@nteract/types";
import { AppRecord } from "@nteract/types";
import * as actions from "@nteract/actions";
import {
  SetNotificationSystemAction,
  SetGithubTokenAction,
  Save,
  SaveFailed,
  SaveFulfilled
} from "@nteract/actions";

function setGithubToken(state: AppRecord, action: SetGithubTokenAction) {
  return state.set("githubToken", action.githubToken);
}

function save(state: AppRecord) {
  return state.set("isSaving", true);
}

function saveFailed(state: AppRecord) {
  return state.set("isSaving", false);
}

function saveFulfilled(state: AppRecord) {
  return state.set("isSaving", false).set("lastSaved", new Date());
}

function setNotificationsSystem(
  state: AppRecord,
  action: SetNotificationSystemAction
) {
  return state.set("notificationSystem", action.notificationSystem);
}

export default function handleApp(
  state: AppRecord = makeAppRecord(),
  action:
    | SetNotificationSystemAction
    | SetGithubTokenAction
    | Save
    | SaveFulfilled
    | SaveFailed
) {
  switch (action.type) {
    case actions.SAVE:
      return save(state);
    case actions.SAVE_FAILED:
      return saveFailed(state);
    case actions.SAVE_FULFILLED:
      return saveFulfilled(state);
    case actions.SET_NOTIFICATION_SYSTEM:
      return setNotificationsSystem(state, action);
    case actions.SET_GITHUB_TOKEN:
      return setGithubToken(state, action);
    default:
      return state;
  }
}
