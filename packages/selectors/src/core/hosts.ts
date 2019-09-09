import { AppState, JupyterHostRecord, ServerConfig } from "@nteract/types";

import { createSelector } from "reselect";

import { currentKernelType } from "./kernels";

/**
 * Creates a server configuration from details about a given Jupyter host.
 *
 * @param   host    The Jupyter host we are connected to
 *
 * @returns         An object contain the endpoint, token
 */
export const serverConfig = (host: JupyterHostRecord): ServerConfig => {
  return {
    endpoint: host.origin + host.basePath,
    crossDomain: host.crossDomain ? host.crossDomain : undefined,
    token: host.token ? host.token : undefined,
    ajaxOptions: host.ajaxOptions ? host.ajaxOptions : undefined,
    wsProtocol: host.wsProtocol ? host.wsProtocol : undefined
  };
};

/**
 * Returns the host the nteract application is connected to.
 */
export const currentHost = (state: AppState) => state.app.host;

/**
 * Returns the type of host the nteract application is currently connected
 * to. This is set to "jupyter" by default.
 */
export const currentHostType = createSelector(
  [currentHost],
  host => {
    if (host && host.type) {
      return host.type;
    }
    return null;
  }
);

/**
 * Returns true if the host we are currently connected to is a Jupyter
 * kernel.
 */
export const isCurrentHostJupyter = createSelector(
  currentHostType,
  hostType => hostType === "jupyter"
);

/**
 * Returns whether or not we are currently connected to the kernel through
 * a websocket connection.
 */
export const isCurrentKernelJupyterWebsocket = createSelector(
  [currentHostType, currentKernelType],
  (hostType, kernelType) => {
    return hostType === "jupyter" && kernelType === "websocket";
  }
);

/**
 * Returns whether or not we are currently connected to the kernel through
 * a ZeroMQ connection.
 */
export const isCurrentKernelZeroMQ = createSelector(
  [currentHostType, currentKernelType],
  (hostType, kernelType) => {
    return hostType === "local" && kernelType === "zeromq";
  }
);
