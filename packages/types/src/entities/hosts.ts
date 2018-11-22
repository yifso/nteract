import * as Immutable from "immutable";

import { HostId } from "../ids";
import { HostRef } from "../refs";

export type EmptyHost = {
  type: "empty"
};
export type EmptyHostRecord = Immutable.RecordOf<EmptyHost>;
export const makeEmptyHostRecord: Immutable.Record.Factory<
  EmptyHost
> = Immutable.Record({
  type: "empty"
} as EmptyHost);

export type BaseHostProps = {
  id?: HostId | null,
  defaultKernelName: string
};

export type JupyterHostRecordProps = BaseHostProps & {
  type: "jupyter",
  token?: string | null,
  origin: string,
  basePath: string,
  crossDomain?: boolean | null
};

export const makeJupyterHostRecord: Immutable.Record.Factory<
  JupyterHostRecordProps
> = Immutable.Record({
  type: "jupyter",
  id: null,
  defaultKernelName: "python",
  token: null,
  origin: typeof location === "undefined" ? "" : location.origin,
  basePath: "/",
  crossDomain: false
} as JupyterHostRecordProps);

export type JupyterHostRecord = Immutable.RecordOf<JupyterHostRecordProps>;

export type LocalHostRecordProps = BaseHostProps & {
  type: "local"
};

export const makeLocalHostRecord: Immutable.Record.Factory<
  LocalHostRecordProps
> = Immutable.Record({
  type: "local",
  id: null,
  defaultKernelName: "python"
} as LocalHostRecordProps);

export type LocalHostRecord = Immutable.RecordOf<LocalHostRecordProps>;

export type HostRecordProps = LocalHostRecordProps | JupyterHostRecordProps;

export type HostRecord = LocalHostRecord | JupyterHostRecord | EmptyHostRecord;

export type HostsRecordProps = {
  byRef: Immutable.Map<HostRef, HostRecord>,
  refs: Immutable.List<HostRef>
};

export const makeHostsRecord: Immutable.Record.Factory<
  HostsRecordProps
> = Immutable.Record({
  byRef: Immutable.Map(),
  refs: Immutable.List()
} as HostsRecordProps);