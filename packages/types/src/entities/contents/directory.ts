import * as Immutable from "immutable";

import { ContentRef } from "../../refs";

export type DirectoryModelRecordProps = {
  type: "directory",
  sortedBy?: "created" | "lastSaved" | "type" | "name",
  groupedBy?: "type" | "mimetype",
  items: Immutable.List<ContentRef>
};
export const makeDirectoryModel: Immutable.Record.Factory<
  DirectoryModelRecordProps
> = Immutable.Record({
  type: "directory",
  items: Immutable.List()
} as DirectoryModelRecordProps);
export type DirectoryModelRecord = Immutable.RecordOf<
  DirectoryModelRecordProps
>;

export type DirectoryContentRecordProps = {
  mimetype: null,
  type: "directory",
  created: Date | null,
  format: "json",
  lastSaved: Date | null,
  filepath: string,
  model: DirectoryModelRecord
};
export const makeDirectoryContentRecord: Immutable.Record.Factory<
  DirectoryContentRecordProps
> = Immutable.Record({
  mimetype: null,
  type: "directory",
  created: null,
  format: "json",
  lastSaved: null,
  filepath: "",
  model: makeDirectoryModel()
} as DirectoryContentRecordProps);
export type DirectoryContentRecord = Immutable.RecordOf<
  DirectoryContentRecordProps
>;