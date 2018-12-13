/**
 * @module commutable
 */
import { ImmutableOutput } from "./outputs";

import { ExecutionCount } from "./primitives";

import {
  Map as ImmutableMap,
  List as ImmutableList,
  Record,
  RecordOf
} from "immutable";

/* CodeCell Record Boilerplate */

type CodeCellParams = {
  cellType: "code";
  // Sadly untyped and widely unspecced
  metadata: ImmutableMap<string, any>;
  executionCount: ExecutionCount;
  source: string;
  outputs: ImmutableList<ImmutableOutput>;
};
export const makeCodeCell = Record<CodeCellParams>({
  cellType: "code",
  executionCount: null,
  metadata: ImmutableMap({
    collapsed: false,
    outputHidden: false,
    inputHidden: false
  }),
  source: "",
  outputs: ImmutableList()
});

export type ImmutableCodeCell = RecordOf<CodeCellParams>;

/* MarkdownCell Record Boilerplate */

type MarkdownCellParams = {
  cellType: "markdown";
  source: string;
  metadata: ImmutableMap<string, any>;
};

export const makeMarkdownCell = Record<MarkdownCellParams>({
  cellType: "markdown",
  metadata: ImmutableMap(),
  source: ""
});

export type ImmutableMarkdownCell = RecordOf<MarkdownCellParams>;

/* RawCell Record Boilerplate */

type RawCellParams = {
  cellType: "raw";
  source: string;
  metadata: ImmutableMap<string, any>;
};

export const makeRawCell = Record<RawCellParams>({
  cellType: "raw",
  metadata: ImmutableMap(),
  source: ""
});

export type ImmutableRawCell = RecordOf<RawCellParams>;

export type ImmutableCell =
  | ImmutableMarkdownCell
  | ImmutableCodeCell
  | ImmutableRawCell;

export type CellType = "raw" | "markdown" | "code";
