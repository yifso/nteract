/**
 * @module actions
 */
import { CellId, CellType, JSONObject } from "@nteract/commutable";
import { ContentRef } from "@nteract/types";

export const TOGGLE_TAG_IN_CELL = "CORE/TOGGLE_TAG_IN_CELL";
export type ToggleTagInCell = {
  // expectation is that if a tag doesn't exist, it will set it
  // if the tag is already in the collection of tags it will delete it
  type: "CORE/TOGGLE_TAG_IN_CELL";
  payload: {
    id: CellId;
    tag: string;
    contentRef: ContentRef;
  };
};

export const SET_IN_CELL = "SET_IN_CELL";
export type SetInCell<T> = {
  type: "SET_IN_CELL";
  payload: {
    id: CellId;
    path: Array<string>;
    value: T;
    contentRef: ContentRef;
  };
};

export const MOVE_CELL = "MOVE_CELL";
export type MoveCell = {
  type: "MOVE_CELL";
  payload: {
    id: CellId;
    destinationId: CellId;
    above: boolean;
    contentRef: ContentRef;
  };
};

export const DELETE_CELL = "DELETE_CELL";
export type DeleteCell = {
  type: "DELETE_CELL";
  payload: {
    id?: CellId;
    contentRef: ContentRef;
  };
};

export const CREATE_CELL_BELOW = "CREATE_CELL_BELOW";
export type CreateCellBelow = {
  type: "CREATE_CELL_BELOW";
  payload: {
    id?: CellId;
    cellType: CellType;
    source: string;
    contentRef: ContentRef;
  };
};

export const CREATE_CELL_ABOVE = "CREATE_CELL_ABOVE";
export type CreateCellAbove = {
  type: "CREATE_CELL_ABOVE";
  payload: {
    cellType: CellType;
    id?: CellId;
    contentRef: ContentRef;
  };
};

// Deprecation Warning: This action type is being deprecated. Please use DELETE_CELL instead
export const REMOVE_CELL = "REMOVE_CELL";
export type RemoveCell = {
  type: "REMOVE_CELL";
  payload: {
    id?: CellId;
    contentRef: ContentRef;
  };
};

// DEPRECATION WARNING: This action type is being deprecated. Please use CREATE_CELL_BELOW instead
export const CREATE_CELL_AFTER = "CREATE_CELL_AFTER";
export type CreateCellAfter = {
  type: "CREATE_CELL_AFTER";
  payload: {
    id?: CellId;
    cellType: CellType;
    source: string;
    contentRef: ContentRef;
  };
};

// DEPRECATION WARNING: This action type is being deprecated. Please use CREATE_CELL_ABOVE instead
export const CREATE_CELL_BEFORE = "CREATE_CELL_BEFORE";
export type CreateCellBefore = {
  type: "CREATE_CELL_BEFORE";
  payload: {
    cellType: CellType;
    id?: CellId;
    contentRef: ContentRef;
  };
};

export const CREATE_CELL_APPEND = "CREATE_CELL_APPEND";
export type CreateCellAppend = {
  type: "CREATE_CELL_APPEND";
  payload: {
    cellType: CellType;
    contentRef: ContentRef;
  };
};

export const UNHIDE_ALL = "UNHIDE_ALL";
export type UnhideAll = {
  type: "UNHIDE_ALL";
  payload: {
    inputHidden: boolean;
    outputHidden: boolean;
    contentRef: ContentRef;
  };
};

export const TOGGLE_CELL_OUTPUT_VISIBILITY = "TOGGLE_CELL_OUTPUT_VISIBILITY";
export type ToggleCellOutputVisibility = {
  type: "TOGGLE_CELL_OUTPUT_VISIBILITY";
  payload: {
    id?: CellId;
    contentRef: ContentRef;
  };
};

export const TOGGLE_CELL_INPUT_VISIBILITY = "TOGGLE_CELL_INPUT_VISIBILITY";
export type ToggleCellInputVisibility = {
  type: "TOGGLE_CELL_INPUT_VISIBILITY";
  payload: {
    id?: CellId;
    contentRef: ContentRef;
  };
};

export const CLEAR_OUTPUTS = "CLEAR_OUTPUTS";
export type ClearOutputs = {
  type: "CLEAR_OUTPUTS";
  payload: {
    id?: CellId;
    contentRef: ContentRef;
  };
};

export const CLEAR_ALL_OUTPUTS = "CLEAR_ALL_OUTPUTS";
export type ClearAllOutputs = {
  type: "CLEAR_ALL_OUTPUTS";
  payload: { contentRef: ContentRef };
};

export const FOCUS_CELL = "FOCUS_CELL";
export type FocusCell = {
  type: "FOCUS_CELL";
  payload: {
    id: CellId;
    contentRef: ContentRef;
  };
};

export const FOCUS_NEXT_CELL = "FOCUS_NEXT_CELL";
export type FocusNextCell = {
  type: "FOCUS_NEXT_CELL";
  payload: {
    id?: CellId;
    createCellIfUndefined: boolean;
    contentRef: ContentRef;
  };
};

export const FOCUS_PREVIOUS_CELL = "FOCUS_PREVIOUS_CELL";
export type FocusPreviousCell = {
  type: "FOCUS_PREVIOUS_CELL";
  payload: {
    id?: CellId;
    contentRef: ContentRef;
  };
};

export const FOCUS_CELL_EDITOR = "FOCUS_CELL_EDITOR";
export type FocusCellEditor = {
  type: "FOCUS_CELL_EDITOR";
  payload: {
    id?: CellId;
    contentRef: ContentRef;
  };
};

export const FOCUS_NEXT_CELL_EDITOR = "FOCUS_NEXT_CELL_EDITOR";
export type FocusNextCellEditor = {
  type: "FOCUS_NEXT_CELL_EDITOR";
  payload: {
    id?: CellId;
    contentRef: ContentRef;
  };
};

export const FOCUS_PREVIOUS_CELL_EDITOR = "FOCUS_PREVIOUS_CELL_EDITOR";
export type FocusPreviousCellEditor = {
  type: "FOCUS_PREVIOUS_CELL_EDITOR";
  payload: {
    id?: CellId;
    contentRef: ContentRef;
  };
};

export const CUT_CELL = "CUT_CELL";
export type CutCell = {
  type: "CUT_CELL";
  payload: { id?: CellId; contentRef: ContentRef };
};

export const COPY_CELL = "COPY_CELL";
export type CopyCell = {
  type: "COPY_CELL";
  payload: { id?: CellId; contentRef: ContentRef };
};

export const PASTE_CELL = "PASTE_CELL";
export type PasteCell = {
  type: "PASTE_CELL";
  payload: { contentRef: ContentRef };
};

export const CHANGE_CELL_TYPE = "CHANGE_CELL_TYPE";
export type ChangeCellType = {
  type: "CHANGE_CELL_TYPE";
  payload: {
    id?: CellId;
    to: CellType;
    contentRef: ContentRef;
  };
};

export const UPDATE_CELL_STATUS = "UPDATE_CELL_STATUS";
export type UpdateCellStatus = {
  type: "UPDATE_CELL_STATUS";
  payload: {
    id: CellId;
    status: string;
    contentRef: ContentRef;
  };
};

export const UPDATE_OUTPUT_METADATA = "UPDATE_OUTPUT_METADATA";
export type UpdateOutputMetadata = {
  type: "UPDATE_OUTPUT_METADATA";
  payload: {
    id: CellId;
    contentRef: ContentRef;
    metadata: JSONObject;
    index: number;
  };
};
