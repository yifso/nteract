/**
 * @module types
 */
import * as Immutable from "immutable";

export interface EmptyModelRecordProps {
  type: "unknown";
}

export const makeEmptyModel = Immutable.Record<EmptyModelRecordProps>({
  type: "unknown"
});
export type EmptyModelRecord = Immutable.RecordOf<EmptyModelRecordProps>;

type NotebookTypes = "unknown" | "directory" | "notebook" | "file";

export interface DummyContentRecordProps {
  type: "dummy";
  assumedType: NotebookTypes;
  mimetype?: string | null;
  lastSaved: null;
  filepath: string;
  model: EmptyModelRecord;
}
export const makeDummyContentRecord = Immutable.Record<DummyContentRecordProps>(
  {
    type: "dummy",
    mimetype: null,
    assumedType: "unknown",
    lastSaved: null,
    filepath: "",
    model: makeEmptyModel()
  }
);
export type DummyContentRecord = Immutable.RecordOf<DummyContentRecordProps>;
