import { KernelRef, ContentRef } from "../types/refs";
import * as actionTypes from "../types/actions/contents";

import { SaveFailed, SAVE_FAILED, Save, SAVE, SaveAs, SAVE_AS, SaveFulfilled, SAVE_FULFILLED } from "../types/actions/save";

export const fetchContent = (payload: {
    filepath: string,
    params: Object,
    kernelRef: KernelRef,
    contentRef: ContentRef
  }): actionTypes.FetchContent => ({
    type: actionTypes.FETCH_CONTENT,
    payload
  });
  
  export const fetchContentFulfilled = (payload: {
    filepath: string,
    model: any,
    kernelRef: KernelRef,
    contentRef: ContentRef
  }): actionTypes.FetchContentFulfilled => ({
    type: actionTypes.FETCH_CONTENT_FULFILLED,
    payload
  });
  
  export const fetchContentFailed = (payload: {
    filepath: string,
    error: Error,
    kernelRef: KernelRef,
    contentRef: ContentRef
  }): actionTypes.FetchContentFailed => ({
    type: actionTypes.FETCH_CONTENT_FAILED,
    payload,
    error: true
  });

  export function downloadContent(payload: {
    contentRef: ContentRef
  }): actionTypes.DownloadContent {
    return {
      type: actionTypes.DOWNLOAD_CONTENT,
      payload
    };
  }
  
  export function downloadContentFailed(payload: {
    contentRef: ContentRef
  }): actionTypes.DownloadContentFailed {
    return {
      type: actionTypes.DOWNLOAD_CONTENT_FAILED,
      payload
    };
  }
  
  export function downloadContentFulfilled(payload: {
    contentRef: ContentRef
  }): actionTypes.DownloadContentFulfilled {
    return {
      type: actionTypes.DOWNLOAD_CONTENT_FULFILLED,
      payload
    };
  }

  export function save(payload: { contentRef: ContentRef }): Save {
    return {
      type: SAVE,
      payload
    };
  }
  
  export function saveAs(payload: {
    filepath: string,
    contentRef: ContentRef
  }): SaveAs {
    return {
      type: SAVE_AS,
      payload
    };
  }
  
  export function saveFailed(payload: {
    error: Error,
    contentRef: ContentRef
  }): SaveFailed {
    return {
      type: SAVE_FAILED,
      payload,
      error: true
    };
  }
  
  export function saveFulfilled(payload: {
    contentRef: ContentRef,
    model: any
  }): SaveFulfilled {
    return {
      type: SAVE_FULFILLED,
      payload
    };
  }
  