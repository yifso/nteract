import { KernelRef, ContentRef } from "../refs";

export const FETCH_CONTENT = "CORE/FETCH_CONTENT";
export type FetchContent = {
  type: "CORE/FETCH_CONTENT",
  payload: {
    filepath: string,
    params: Object,
    kernelRef: KernelRef,
    contentRef: ContentRef
  }
};

export const FETCH_CONTENT_FULFILLED = "CORE/FETCH_CONTENT_FULFILLED";
export type FetchContentFulfilled = {
  type: "CORE/FETCH_CONTENT_FULFILLED",
  payload: {
    filepath: string,
    model: any, // literal response from API
    kernelRef: KernelRef,
    contentRef: ContentRef
  }
};

export const DOWNLOAD_CONTENT = "CORE/DOWNLOAD_CONTENT";
export type DownloadContent = {
  type: "CORE/DOWNLOAD_CONTENT",
  payload: {
    contentRef: ContentRef
  }
};

export const DOWNLOAD_CONTENT_FAILED = "CORE/DOWNLOAD_CONTENT_FAILED";
export type DownloadContentFailed = {
  type: "CORE/DOWNLOAD_CONTENT_FAILED",
  payload: { contentRef: ContentRef }
};

export const DOWNLOAD_CONTENT_FULFILLED = "CORE/DOWNLOAD_CONTENT_FULFILLED";
export type DownloadContentFulfilled = {
  type: "CORE/DOWNLOAD_CONTENT_FULFILLED",
  payload: { contentRef: ContentRef }
};

export const FETCH_CONTENT_FAILED = "CORE/FETCH_CONTENT_FAILED";
export type FetchContentFailed = {
  type: "CORE/FETCH_CONTENT_FAILED",
  payload: {
    filepath: string,
    error: Error,
    kernelRef: KernelRef,
    contentRef: ContentRef
  },
  error: true
};