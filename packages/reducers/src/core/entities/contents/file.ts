import * as actionTypes from "@nteract/actions";
import { FileModelRecord } from "@nteract/types";

function updateFileText(
  state: FileModelRecord,
  action: actionTypes.UpdateFileText
) {
  return state.set("text", action.payload.text);
}

type FileAction = actionTypes.UpdateFileText;

export function file(state: FileModelRecord, action: FileAction) {
  switch (action.type) {
    case actionTypes.UPDATE_FILE_TEXT:
      return updateFileText(state, action);
    default:
      return state;
  }
}
