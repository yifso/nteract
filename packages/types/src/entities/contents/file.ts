import * as Immutable from "immutable";

export type FileModelRecordProps = {
  type: "file",
  text: string
};
export const makeFileModelRecord: Immutable.Record.Factory<
  FileModelRecordProps
> = Immutable.Record({
  type: "file",
  text: ""
} as FileModelRecordProps);
export type FileModelRecord = Immutable.RecordOf<FileModelRecordProps>;

export type FileContentRecordProps = {
  type: "file",
  mimetype?: string | null,
  created?: Date | null,
  format: "json",
  lastSaved: null,
  filepath: string,
  model: FileModelRecord
};
export const makeFileContentRecord: Immutable.Record.Factory<
  FileContentRecordProps
> = Immutable.Record({
  type: "file",
  mimetype: null,
  created: null,
  format: "json",
  lastSaved: null,
  filepath: "",
  model: makeFileModelRecord()
} as FileContentRecordProps);

export type FileContentRecord = Immutable.RecordOf<FileContentRecordProps>;