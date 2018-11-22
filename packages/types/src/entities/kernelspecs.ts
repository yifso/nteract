import { RecordOf } from "immutable";
import { List, Map, Record } from "immutable";

import { HostRef, KernelspecsRef } from "../refs";

export type KernelspecProps = {
  name: string,
  argv: List<string>,
  env: Map<string, any>,
  interruptMode?: string | null,
  language: string,
  displayName: string,
  resources: Map<string, any>,
  metadata: Map<string, any>
};

export const makeKernelspec: Record.Factory<KernelspecProps> = Record({
  name: "",
  argv: List(),
  env: Map(),
  interruptMode: null,
  language: "",
  displayName: "",
  metadata: Map(),
  resources: Map()
} as KernelspecProps);

export type KernelspecRecord = RecordOf<KernelspecProps>;

export type KernelspecsByRefRecordProps = {
  hostRef?: HostRef | null,
  defaultKernelName: string,
  byName: Map<string, KernelspecRecord>
};

export type KernelspecsByRefRecord = RecordOf<KernelspecsByRefRecordProps>;

export const makeKernelspecsByRefRecord: Record.Factory<
  KernelspecsByRefRecordProps
> = Record({
  hostRef: null,
  defaultKernelName: "python",
  byName: Map()
} as KernelspecsByRefRecordProps);

export type KernelspecsRecordProps = {
  byRef: Map<KernelspecsRef, RecordOf<KernelspecsByRefRecordProps>>,
  refs: List<KernelspecsRef>
};

export const makeKernelspecsRecord: Record.Factory<
  KernelspecsRecordProps
> = Record({
  byRef: Map(),
  refs: List()
} as KernelspecsRecordProps);

export type KernelSpecsRecord = RecordOf<KernelspecsRecordProps>;