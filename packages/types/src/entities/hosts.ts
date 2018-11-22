import * as Immutable from "immutable";

import { HostId } from "../ids";
import { HostRef } from "../refs";

export type EmptyHost = {
  type: "empty"
};
export type EmptyHostRecord = Immutable.RecordOf<EmptyHost>;
export const makeEmptyHostRecord: Immutable.RecordFactory<
  EmptyHost
> = Immutable.Record({
  type: "empty"
});

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
});

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
});

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
});