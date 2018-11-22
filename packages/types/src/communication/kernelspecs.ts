import * as Immutable from "immutable";

import { KernelspecsRef } from "../refs";

export type KernelspecsByRefCommunicationRecordProps = {
  loading: boolean,
  error?: Object | null
};

export const makeKernelspecsByRefCommunicationRecord: Immutable.Record.Factory<
  KernelspecsByRefCommunicationRecordProps
> = Immutable.Record({
  loading: false,
  error: null
} as KernelspecsByRefCommunicationRecordProps);

export type KernelspecsCommunicationRecordProps = {
  byRef: Immutable.Map<
    KernelspecsRef,
    Immutable.RecordOf<KernelspecsByRefCommunicationRecordProps>
  >
};

export const makeKernelspecsCommunicationRecord: Immutable.Record.Factory<
  KernelspecsCommunicationRecordProps
> = Immutable.Record({
  byRef: Immutable.Map()
} as KernelspecsCommunicationRecordProps);