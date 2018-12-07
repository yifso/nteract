import * as actions from "@nteract/actions";
import { FileModelRecord } from "@nteract/types";

function updateFileText(
  state: FileModelRecord,
  action: actions.UpdateFileText
) {
  return state.set("text", action.payload.text);
}

export function file(state: FileModelRecord, action: actions.UpdateFileText) {
  switch (action.type) {
    case actions.UPDATE_FILE_TEXT:
      return updateFileText(state, action);
    default:
      return state;
  }
}
