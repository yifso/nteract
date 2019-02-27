/**
 * @module actions
 */

// Vendor modules
import { ContentRef } from "@nteract/types";

// Local modules
import * as actionTypes from "../actionTypes";

export const publishToBookstore = (payload: {
  contentRef: ContentRef;
}): actionTypes.PublishToBookstore => {
  // TODO: Remove console.log
  console.log("sending first action to save to bookstore");
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
