import * as actionTypes from "../actionTypes";

export function startSession(
  payload: actionTypes.StartSession["payload"]
): actionTypes.StartSession {
  return {
    type: actionTypes.START_SESSION,
    payload
  };
}
