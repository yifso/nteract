import * as Immutable from "immutable";

export type EmptyModelRecordProps = {
  type: "unknown";
};

export const makeEmptyModel = Immutable.Record<EmptyModelRecordProps>({
  type: "unknown"
});
export type EmptyModelRecord = Immutable.RecordOf<EmptyModelRecordProps>;

type NotebookTypes = "unknown" | "directory" | "notebook" | "file";

export type DummyContentRecordProps = {
  type: "dummy";
  assumedType: NotebookTypes;
  mimetype?: string | null;
  lastSaved: null;
  filepath: string;
  model: EmptyModelRecord;
};
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
export type DummyContentFileRecordProps = {
  kernel: {
    id: string,
    name: "ir"
  },
  created: string | null,
  last_modified: string | null,
  writable: boolean,
  name: string,
  path: string,
  type: NotebookTypes,
  mimetype?: string | null,
  content: string,
  format: string
};
export const makeDummyContentFileRecord = Immutable.Record<DummyContentFileRecordProps>(
  {
    kernel: {
      id: "",
      name: "ir"
    },
    created: null,
    last_modified: null,
    writable: true,
    name: "",
    path: "",
    type: "notebook",
    mimetype: null,
    content: "",
    format: ""
  }
);
export type DummyContentRecord = Immutable.RecordOf<DummyContentRecordProps>;
