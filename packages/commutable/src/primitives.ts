import { Map as ImmutableMap, List as ImmutableList, Record } from "immutable";

import { ImmutableOutput } from "./outputs";
import { ImmutableCell } from "./cells";

export type ExecutionCount = number | null;

// Mutable JSON types
export type PrimitiveImmutable = string | number | boolean | null;
export type JSONType = PrimitiveImmutable | JSONObject | JSONArray;
export interface JSONObject {
  [key: string]: JSONType;
}
export interface JSONArray extends Array<JSONType> {}

export type CellID = string;

export type NotebookRecordParams = {
  cellOrder: ImmutableList<string>;
  cellMap: ImmutableMap<string, ImmutableCell>;
  nbformat_minor: number;
  nbformat: number;
  metadata: ImmutableMap<string, any>;
};

export const makeNotebookRecord = Record<NotebookRecordParams>({
  cellOrder: ImmutableList(),
  cellMap: ImmutableMap(),
  nbformat_minor: 0,
  nbformat: 4,
  metadata: ImmutableMap()
});

export type ImmutableNotebook = Record<NotebookRecordParams> &
  Readonly<NotebookRecordParams>;

export type ImmutableOutputs = ImmutableList<ImmutableOutput>;

export type ImmutableCellOrder = ImmutableList<CellID>;
export type ImmutableCellMap = ImmutableMap<CellID, ImmutableCell>;

// On disk multi-line strings are used to accomodate line-by-line diffs in tools
// like git and GitHub. They get converted to strings for the in-memory format.
export type MultiLineString = string | string[];
