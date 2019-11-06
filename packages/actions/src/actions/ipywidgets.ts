import * as actionTypes from "../actionTypes";

export function redirectOutputToModel(
  payload: actionTypes.RedirectOutputToModel["payload"]
): actionTypes.RedirectOutputToModel {
  return {
    type: actionTypes.REDIRECT_OUTPUT_TO_MODEL,
    payload
  };
}

export function clearOutputInModel(
  payload: actionTypes.ClearOutputInModel["payload"]
): actionTypes.ClearOutputInModel {
  return {
    type: actionTypes.CLEAR_OUTPUT_IN_MODEL,
    payload
  };
}
