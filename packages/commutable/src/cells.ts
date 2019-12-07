import { ImmutableOutput } from "./outputs";

import { ExecutionCount } from "./primitives";

import {
  List as ImmutableList,
  Map as ImmutableMap,
  Record,
  RecordOf
} from "immutable";

export interface TransientCellParam {
  deleting: boolean;
}

export interface TransientCellParams {
  transient: RecordOf<TransientCellParam>;
}

const makeCellTransientParam = Record<TransientCellParam>({
  deleting: false,
});

/* CodeCell Record Boilerplate */

export interface CodeCellParams extends TransientCellParams {
  cell_type: "code";
  // Sadly untyped and widely unspecced
  metadata: ImmutableMap<string, any>;
  execution_count: ExecutionCount;
  source: string;
  outputs: ImmutableList<ImmutableOutput>;
}

export const makeCodeCell = Record<CodeCellParams>({
  cell_type: "code",
  execution_count: null,
  metadata: ImmutableMap({
    collapsed: false,
    outputHidden: false,
    inputHidden: false
  }),
  transient: makeCellTransientParam(),
  source: "",
  outputs: ImmutableList()
});

export type ImmutableCodeCell = RecordOf<CodeCellParams>;

/* MarkdownCell Record Boilerplate */

export interface MarkdownCellParams extends TransientCellParams {
  cell_type: "markdown";
  source: string;
  metadata: ImmutableMap<string, any>;
}

export const makeMarkdownCell = Record<MarkdownCellParams>({
  cell_type: "markdown",
  metadata: ImmutableMap(),
  transient: makeCellTransientParam(),
  source: ""
});

export type ImmutableMarkdownCell = RecordOf<MarkdownCellParams>;

/* RawCell Record Boilerplate */

export interface RawCellParams extends TransientCellParams {
  cell_type: "raw";
  source: string;
  metadata: ImmutableMap<string, any>;
}

export const makeRawCell = Record<RawCellParams>({
  cell_type: "raw",
  metadata: ImmutableMap(),
  transient: makeCellTransientParam(),
  source: ""
});

export type ImmutableRawCell = RecordOf<RawCellParams>;

export type ImmutableCell =
  | ImmutableMarkdownCell
  | ImmutableCodeCell
  | ImmutableRawCell;

export type CellType = "raw" | "markdown" | "code";
