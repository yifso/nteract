import { CellId } from "@nteract/commutable";
import { ContentRef } from "@nteract/types";

export const ENQUEUE_ACTION = "ENQUEUE_ACTION";
export interface EnqueueAction {
  type: "ENQUEUE_ACTION";
  payload: {
    id: CellId;
    contentRef: ContentRef;
  };
}

export const CLEAR_MESSAGE_QUEUE = "CLEAR_MESSAGE_QUEUE";
export interface ClearMessageQueue {
  type: "CLEAR_MESSAGE_QUEUE";
}