import * as Immutable from "immutable";

import { KernelRef } from "../refs";

export type KernelCommunicationRecordProps = {
  loading: boolean,
  error?: object | null
};

export const makeKernelCommunicationRecord: Immutable.Record.Factory<
  KernelCommunicationRecordProps
> = Immutable.Record({
  loading: false,
  error: null
});

export type KernelsCommunicationRecordProps = {
  byRef: Immutable.Map<
    KernelRef,
    Immutable.RecordOf<KernelCommunicationRecordProps>
  >
};

export const makeKernelsCommunicationRecord: Immutable.Record.Factory<
  KernelsCommunicationRecordProps
> = Immutable.Record({
  byRef: Immutable.Map()
});