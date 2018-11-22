import * as Immutable from "immutable";

import { ContentRef } from "../refs";

export type ContentCommunicationRecordProps = {
  loading: boolean,
  saving: boolean,
  error?: Object | null
};

export const makeContentCommunicationRecord: Immutable.Record.Factory<
  ContentCommunicationRecordProps
> = Immutable.Record({
  loading: false,
  saving: false,
  error: null
});

export type ContentsCommunicationRecordProps = {
  byRef: Immutable.Map<
    ContentRef,
    Immutable.RecordOf<ContentCommunicationRecordProps>
  >
};

export const makeContentsCommunicationRecord: Immutable.Record.Factory<
  ContentsCommunicationRecordProps
> = Immutable.Record({
  byRef: Immutable.Map()
});