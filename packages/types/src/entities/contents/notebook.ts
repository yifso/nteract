/**
 * @module types
 */
import {
  CellId,
  emptyNotebook,
  ImmutableCell,
  ImmutableNotebook
} from "@nteract/commutable";
import * as Immutable from "immutable";

import { KernelRef } from "../..";

// `Bookstore` Data Model. For more info, see:
// https://jupyter-notebook.readthedocs.io/en/stable/extending/contents.html#data-model
export interface BookstoreDataModel {
  name: string;
  path: string;
  type: "notebook";
  created: string;
  last_modified: string;
  content: ImmutableNotebook;
  mimetype: string;
  format: "json";
}

export interface DocumentRecordProps {
  type: "notebook";
  notebook: ImmutableNotebook;
  savedNotebook: ImmutableNotebook;
  // has the keypaths for updating displays
  transient: Immutable.Map<string, any>;
  // transient should be more fully typed (be a record itself)
  // right now it's keypaths and then it looks like it's able to handle any per
  // cell transient data that will be deleted when the kernel is restarted
  cellPagers: any;
  editorFocused?: CellId | null;
  cellFocused?: CellId | null;
  copied: ImmutableCell | null;
  kernelRef?: KernelRef | null;
}
export const makeDocumentRecord = Immutable.Record<DocumentRecordProps>({
  type: "notebook",
  notebook: emptyNotebook,
  savedNotebook: emptyNotebook,
  transient: Immutable.Map({
    keyPathsForDisplays: Immutable.Map()
  }),
  cellPagers: Immutable.Map(),
  editorFocused: null,
  cellFocused: null,
  copied: null,
  kernelRef: null
});
export type NotebookModel = Immutable.RecordOf<DocumentRecordProps>;

export interface NotebookContentRecordProps {
  mimetype?: string | null;
  created?: Date | null;
  format: "json";
  lastSaved?: Date | null;
  model: NotebookModel;
  filepath: string;
  type: "notebook";
  writable: boolean;
  saving: boolean;
  loading: boolean;
  error?: object | null;
  showHeaderEditor?: boolean;
}

export const makeNotebookContentRecord = Immutable.Record<
  NotebookContentRecordProps
>({
  mimetype: null,
  created: null,
  format: "json",
  lastSaved: null,
  model: makeDocumentRecord(),
  filepath: "",
  type: "notebook",
  writable: true,
  saving: false,
  loading: false,
  error: null,
  showHeaderEditor: false
});

export type NotebookContentRecord = Immutable.RecordOf<
  NotebookContentRecordProps
>;
