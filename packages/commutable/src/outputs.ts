/**
 * @module commutable
 */
import {
  fromJS as immutableFromJS,
  List as ImmutableList,
  Map as ImmutableMap,
  Record,
  RecordOf
} from "immutable";

import {
  createFrozenMediaBundle,
  demultiline,
  remultiline,
  ExecutionCount,
  JSONObject,
  MediaBundle,
  MultiLineString,
  OnDiskMediaBundle
} from "./primitives";

/** ExecuteResult Record Boilerplate */
interface ExecuteResultParams {
  output_type: "execute_result";
  execution_count: ExecutionCount;
  data: Readonly<MediaBundle>;
  metadata?: any;
}

// Used for initializing all output records
const emptyMediaBundle = Object.freeze({});

export const makeExecuteResult = Record<ExecuteResultParams>({
  data: emptyMediaBundle,
  execution_count: null,
  metadata: ImmutableMap(),
  output_type: "execute_result"
});

export type ImmutableExecuteResult = RecordOf<ExecuteResultParams>;

/** DisplayData Record Boilerplate */

interface DisplayDataParams {
  data: Readonly<MediaBundle>;
  output_type: "display_data";
  metadata?: any;
}

export const makeDisplayData = Record<DisplayDataParams>({
  data: emptyMediaBundle,
  metadata: ImmutableMap(),
  output_type: "display_data"
});

export type ImmutableDisplayData = RecordOf<DisplayDataParams>;

/** StreamOutput Record Boilerplate */

interface StreamOutputParams {
  output_type: "stream";
  name: "stdout" | "stderr";
  text: string;
}

export const makeStreamOutput = Record<StreamOutputParams>({
  name: "stdout",
  output_type: "stream",
  text: ""
});

type ImmutableStreamOutput = RecordOf<StreamOutputParams>;

/** ErrorOutput Record Boilerplate */

interface ErrorOutputParams {
  output_type: "error";
  ename: string;
  evalue: string;
  traceback: ImmutableList<string>;
}

export const makeErrorOutput = Record<ErrorOutputParams>({
  ename: "",
  evalue: "",
  output_type: "error",
  traceback: ImmutableList()
});

type ImmutableErrorOutput = RecordOf<ErrorOutputParams>;

//////////////

export type ImmutableOutput =
  | ImmutableExecuteResult
  | ImmutableDisplayData
  | ImmutableStreamOutput
  | ImmutableErrorOutput;

//////// OUTPUTS /////

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *                             Output Types
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

export interface ExecuteResult {
  output_type: "execute_result";
  execution_count: ExecutionCount;
  data: OnDiskMediaBundle;
  metadata: JSONObject;
}

export interface DisplayData {
  output_type: "display_data";
  data: OnDiskMediaBundle;
  metadata: JSONObject;
  transient?: JSONObject;
}

export interface StreamOutput {
  output_type: "stream";
  name: "stdout" | "stderr";
  text: MultiLineString;
}

export interface ErrorOutput {
  output_type: "error" | "pyerr";
  ename: string;
  evalue: string;
  traceback: string[];
}

export type Output = ExecuteResult | DisplayData | StreamOutput | ErrorOutput;

/**
 * Converts a mutable representation of an output to an immutable representation.
 *
 * @param output The mutable output that will be converted.
 *
 * @returns ImmutableOutput An immutable representation of the same output.
 */
export function createImmutableOutput(output: Output): ImmutableOutput {
  switch (output.output_type) {
    case "execute_result":
      return makeExecuteResult({
        data: createFrozenMediaBundle(output.data),
        execution_count: output.execution_count,
        metadata: immutableFromJS(output.metadata)
      });
    case "display_data":
      return makeDisplayData({
        data: createFrozenMediaBundle(output.data),
        metadata: immutableFromJS(output.metadata)
      });
    case "stream":
      return makeStreamOutput({
        name: output.name,
        text: demultiline(output.text)
      });
    case "error":
      return makeErrorOutput({
        ename: output.ename,
        evalue: output.evalue,
        output_type: "error",
        // Note: this is one of the cases where the Array of strings (for
        // traceback) is part of the format, not a multiline string
        traceback: ImmutableList(output.traceback)
      });
    default:
      throw new TypeError(`Output type ${output.output_type} not recognized`);
  }
}
