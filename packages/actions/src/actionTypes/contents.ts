// tslint:disable:max-line-length
import { JSONObject, MediaBundle } from "@nteract/commutable";
import { HeaderDataProps, KernelspecInfo } from "@nteract/types";
import { Action, ErrorAction, HasContent, HasFilepath, HasFilepathChange, HasKernel, MaybeHasContent } from "../utils";

export const TOGGLE_HEADER_EDITOR           = "CORE/TOGGLE_HEADER_EDITOR";
export const CHANGE_CONTENT_NAME            = "CORE/CHANGE_CONTENT_NAME";
export const CHANGE_CONTENT_NAME_FULFILLED  = "CORE/CHANGE_CONTENT_NAME_FULFILLED";
export const CHANGE_CONTENT_NAME_FAILED     = "CORE/CHANGE_CONTENT_NAME_FAILED";
export const FETCH_CONTENT                  = "CORE/FETCH_CONTENT";
export const FETCH_CONTENT_FULFILLED        = "CORE/FETCH_CONTENT_FULFILLED";
export const FETCH_CONTENT_FAILED           = "CORE/FETCH_CONTENT_FAILED";
export const DOWNLOAD_CONTENT               = "CORE/DOWNLOAD_CONTENT";
export const DOWNLOAD_CONTENT_FULFILLED     = "CORE/DOWNLOAD_CONTENT_FULFILLED";
export const DOWNLOAD_CONTENT_FAILED        = "CORE/DOWNLOAD_CONTENT_FAILED";
export const SAVE                           = "SAVE";
export const SAVE_FULFILLED                 = "SAVE_FULFILLED";
export const SAVE_FAILED                    = "SAVE_FAILED";
export const SAVE_AS                        = "SAVE_AS";
export const SAVE_AS_FULFILLED              = "SAVE_AS_FULFILLED";
export const SAVE_AS_FAILED                 = "SAVE_AS_FAILED";
export const NEW_NOTEBOOK                   = "NEW_NOTEBOOK";
export const UPDATE_FILE_TEXT               = "UPDATE_FILE_TEXT";
export const CLOSE_NOTEBOOK                 = "CLOSE_NOTEBOOK";
export const DISPOSE_CONTENT                = "DISPOSE_CONTENT";
export const OVERWRITE_METADATA_FIELDS      = "CORE/OVERWRITE_METADATA_FIELDS";
export const CHANGE_FILENAME                = "CHANGE_FILENAME";
export const UPDATE_DISPLAY                 = "UPDATE_DISPLAY";
export const UPDATE_DISPLAY_FAILED          = "UPDATE_DISPLAY_FAILED";
export const OVERWRITE_METADATA_FIELD       = "OVERWRITE_METADATA_FIELD";
export const DELETE_METADATA_FIELD          = "DELETE_METADATA_FIELD";
export const PUBLISH_GIST                   = "CORE/PUBLISH_GIST";

export type ToggleHeaderEditor              = Action     <typeof TOGGLE_HEADER_EDITOR,          HasContent>;
export type ChangeContentName               = Action     <typeof CHANGE_CONTENT_NAME,           HasContent & HasFilepathChange>;
export type ChangeContentNameFulfilled      = Action     <typeof CHANGE_CONTENT_NAME_FULFILLED, HasContent & HasFilepathChange>;
export type ChangeContentNameFailed         = ErrorAction<typeof CHANGE_CONTENT_NAME_FAILED,    HasContent & HasFilepathChange & { basepath: string }>;
export type FetchContent                    = Action     <typeof FETCH_CONTENT,                 HasContent & HasKernel & HasFilepath & { params: object }>;
export type FetchContentFulfilled           = Action     <typeof FETCH_CONTENT_FULFILLED,       HasContent & HasKernel & HasFilepath & { model: any; created?: Date | null; lastSaved?: Date | null }>;
export type FetchContentFailed              = ErrorAction<typeof FETCH_CONTENT_FAILED,          HasContent & HasKernel & HasFilepath>;
export type DownloadContent                 = Action     <typeof DOWNLOAD_CONTENT,              HasContent>;
export type DownloadContentFulfilled        = Action     <typeof DOWNLOAD_CONTENT_FULFILLED,    HasContent>;
export type DownloadContentFailed           = ErrorAction<typeof DOWNLOAD_CONTENT_FAILED,       HasContent>;
export type Save                            = Action     <typeof SAVE,                          HasContent>;
export type SaveFulfilled                   = Action     <typeof SAVE_FULFILLED,                HasContent & { model: any }>;
export type SaveFailed                      = ErrorAction<typeof SAVE_FAILED,                   HasContent>;
export type SaveAs                          = Action     <typeof SAVE_AS,                       HasContent & HasFilepath>;
export type SaveAsFulfilled                 = Action     <typeof SAVE_AS_FULFILLED,             HasContent & { model: any }>;
export type SaveAsFailed                    = ErrorAction<typeof SAVE_AS_FAILED,                HasContent>;
export type NewNotebook                     = Action     <typeof NEW_NOTEBOOK,                  HasContent & HasKernel & { filepath: string | null; cwd: string; kernelSpec: KernelspecInfo }>;
export type UpdateFileText                  = Action     <typeof UPDATE_FILE_TEXT,              HasContent & { text: string }>;
export type CloseNotebook                   = Action     <typeof CLOSE_NOTEBOOK,                HasContent>;
export type DisposeContent                  = Action     <typeof DISPOSE_CONTENT,               HasContent>;
export type OverwriteMetadataFields         = Action     <typeof OVERWRITE_METADATA_FIELDS,     MaybeHasContent & Partial<HeaderDataProps>>;
export type ChangeFilenameAction            = Action     <typeof CHANGE_FILENAME,               HasContent &  { filepath?: string }>;
export type UpdateDisplay                   = Action     <typeof UPDATE_DISPLAY,                HasContent &  { content:  { output_type: "update_display_data"; data: MediaBundle; metadata: JSONObject; transient: { display_id: string } } }>;
export type UpdateDisplayFailed             = ErrorAction<typeof UPDATE_DISPLAY_FAILED,         HasContent>;
export type OverwriteMetadataField          = Action     <typeof OVERWRITE_METADATA_FIELD,      HasContent &  { field: string; value: any }>;
export type DeleteMetadataField             = Action     <typeof DELETE_METADATA_FIELD,         HasContent &  { field: string }>;
export type PublishGist                     = Action     <typeof PUBLISH_GIST,                  HasContent>;

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
