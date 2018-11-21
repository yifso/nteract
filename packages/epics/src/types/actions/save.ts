import { ContentRef } from "../refs";

export const SAVE_FAILED = "SAVE_FAILED";
export type SaveFailed = {
  type: "SAVE_FAILED",
  payload: {
    contentRef: ContentRef
  }
};

export const SAVE_FULFILLED = "SAVE_FULFILLED";
export type SaveFulfilled = {
  type: "SAVE_FULFILLED",
  payload: {
    contentRef: ContentRef,
    // Literal response from contents API, for use with
    model: any
  }
};

export const SAVE = "SAVE";
export type Save = {
  type: "SAVE",
  payload: {
    contentRef: ContentRef
  }
};

export const SAVE_AS = "SAVE_AS";
export type SaveAs = {
  type: "SAVE_AS",
  payload: {
    filepath: string,
    contentRef: ContentRef
  }
};