// tslint:disable:max-line-length
import { JSONObject, MediaBundle } from "@nteract/commutable";
import { HeaderDataProps, KernelspecInfo } from "@nteract/types";
import { Action, ErrorAction, HasContent, HasFilepath, HasFilepathChange, HasKernel, MaybeHasContent } from "../utils";

export const CHANGE_CONTENT_NAME            = "CORE/CHANGE_CONTENT_NAME";
export const CHANGE_CONTENT_NAME_FULFILLED  = "CORE/CHANGE_CONTENT_NAME_FULFILLED";
export const CHANGE_CONTENT_NAME_FAILED     = "CORE/CHANGE_CONTENT_NAME_FAILED";
export const NEW_NOTEBOOK                   = "NEW_NOTEBOOK";
export const CLOSE_NOTEBOOK                 = "CLOSE_NOTEBOOK";
export const DISPOSE_CONTENT                = "DISPOSE_CONTENT";
export const CHANGE_FILENAME                = "CHANGE_FILENAME";

export type ChangeContentName               = Action     <typeof CHANGE_CONTENT_NAME,           HasContent & HasFilepathChange>;
export type ChangeContentNameFulfilled      = Action     <typeof CHANGE_CONTENT_NAME_FULFILLED, HasContent & HasFilepathChange>;
export type ChangeContentNameFailed         = ErrorAction<typeof CHANGE_CONTENT_NAME_FAILED,    HasContent & HasFilepathChange & { basepath: string }>;
export type ChangeFilenameAction            = Action     <typeof CHANGE_FILENAME,               HasContent &  { filepath?: string }>;
export type NewNotebook                     = Action     <typeof NEW_NOTEBOOK,                  HasContent & HasKernel & { filepath: string | null; cwd: string; kernelSpec: KernelspecInfo }>;
export type CloseNotebook                   = Action     <typeof CLOSE_NOTEBOOK,                HasContent>;
export type DisposeContent                  = Action     <typeof DISPOSE_CONTENT,               HasContent>;

// TODO: New Notebook action should use a kernel spec type
export function newNotebook(
  payload: NewNotebook["payload"]
): NewNotebook {
  return {
    type: NEW_NOTEBOOK,
    payload: {
      filepath: payload.filepath,
      kernelSpec: payload.kernelSpec,
      cwd: payload.cwd || process.cwd(), // Desktop should be passing in the cwd
      kernelRef: payload.kernelRef,
      contentRef: payload.contentRef
    }
  };
}
