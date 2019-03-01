/**
 * @module actions
 */

// Vendor modules
import { ContentRef } from "@nteract/types";

// Local modules
import * as actionTypes from "../actionTypes";

export const toggleHeaderEditor = (payload: {
  contentRef: ContentRef;
}): actionTypes.ToggleHeaderEditor => ({
  type: actionTypes.TOGGLE_HEADER_EDITOR,
  payload
});

export const publishToBookstore = (payload: {
  contentRef: ContentRef;
}): actionTypes.PublishToBookstore => {
  return {
    type: actionTypes.PUBLISH_TO_BOOKSTORE,
    payload
  };
};

export const publishToBookstoreSucceeded = (payload: {
  contentRef: ContentRef;
}): actionTypes.PublishToBookstoreSucceeded => ({
  type: actionTypes.PUBLISH_TO_BOOKSTORE_SUCCEEDED,
  payload
});

export const publishToBookstoreFailed = (payload: {
  contentRef: ContentRef;
  error: Error;
}): actionTypes.PublishToBookstoreFailed => ({
  type: actionTypes.PUBLISH_TO_BOOKSTORE_FAILED,
  payload
});
