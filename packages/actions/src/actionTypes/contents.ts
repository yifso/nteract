/**
 * @module actions
 */
import { ContentRef, KernelRef, KernelspecInfo } from "@nteract/types";

export const UPDATE_CONTENT = "CORE/UPDATE_CONTENT";
export type UpdateContent = {
  type: "CORE/UPDATE_CONTENT";
  payload: {
    filepath: string;
    kernelRef: KernelRef;
    contentRef: ContentRef;
  };
};

export const FETCH_CONTENT = "CORE/FETCH_CONTENT";
export type FetchContent = {
  type: "CORE/FETCH_CONTENT";
  payload: {
    filepath: string;
    params: Object;
    kernelRef: KernelRef;
    contentRef: ContentRef;
  };
};

export const FETCH_CONTENT_FULFILLED = "CORE/FETCH_CONTENT_FULFILLED";
export type FetchContentFulfilled = {
  type: "CORE/FETCH_CONTENT_FULFILLED";
  payload: {
    filepath: string;
    model: any; // literal response from API
    kernelRef: KernelRef;
    contentRef: ContentRef;
    created?: Date | null;
    lastSaved?: Date | null;
  };
};

export const FETCH_CONTENT_FAILED = "CORE/FETCH_CONTENT_FAILED";
export type FetchContentFailed = {
  type: "CORE/FETCH_CONTENT_FAILED";
  payload: {
    filepath: string;
    error: Error;
    kernelRef: KernelRef;
    contentRef: ContentRef;
  };
  error: true;
};

export const DOWNLOAD_CONTENT = "CORE/DOWNLOAD_CONTENT";
export type DownloadContent = {
  type: "CORE/DOWNLOAD_CONTENT";
  payload: {
    contentRef: ContentRef;
  };
};

export const DOWNLOAD_CONTENT_FAILED = "CORE/DOWNLOAD_CONTENT_FAILED";
export type DownloadContentFailed = {
  type: "CORE/DOWNLOAD_CONTENT_FAILED";
  payload: { contentRef: ContentRef };
};

export const DOWNLOAD_CONTENT_FULFILLED = "CORE/DOWNLOAD_CONTENT_FULFILLED";
export type DownloadContentFulfilled = {
  type: "CORE/DOWNLOAD_CONTENT_FULFILLED";
  payload: { contentRef: ContentRef };
};

export const SAVE = "SAVE";
export type Save = {
  type: "SAVE";
  payload: {
    contentRef: ContentRef;
  };
};

export const SAVE_AS = "SAVE_AS";
export type SaveAs = {
  type: "SAVE_AS";
  payload: {
    filepath: string;
    contentRef: ContentRef;
  };
};

export const SAVE_FAILED = "SAVE_FAILED";
export type SaveFailed = {
  type: "SAVE_FAILED";
  payload: {
    contentRef: ContentRef;
    error: Error;
  };
  error: true;
};

export const SAVE_FULFILLED = "SAVE_FULFILLED";
export type SaveFulfilled = {
  type: "SAVE_FULFILLED";
  payload: {
    contentRef: ContentRef;
    // Literal response from contents API, for use with
    model: any;
  };
};

export const NEW_NOTEBOOK = "NEW_NOTEBOOK";
export type NewNotebook = {
  type: "NEW_NOTEBOOK";
  payload: {
    cwd: string;
    kernelSpec: KernelspecInfo;
    kernelRef: KernelRef;
    contentRef: ContentRef;
  };
};

export const UPDATE_FILE_TEXT = "UPDATE_FILE_TEXT";
export type UpdateFileText = {
  type: "UPDATE_FILE_TEXT";
  payload: {
    text: string;
    contentRef: ContentRef;
  };
};
