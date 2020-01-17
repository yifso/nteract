import { ContentRef } from "@nteract/types";
import * as actionTypes from "../actionTypes";

export function enqueueAction(payload: {
  id: string;
  contentRef: ContentRef;
}): actionTypes.EnqueueAction {
  return {
    type: actionTypes.ENQUEUE_ACTION,
    payload
  };
}
  
export function clearMessageQueue(): actionTypes.ClearMessageQueue {
  return {
    type: actionTypes.CLEAR_MESSAGE_QUEUE
  };
}