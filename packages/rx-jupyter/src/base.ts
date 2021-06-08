/** tslint:disable:jsdoc-format */
import Cookies from "js-cookie";
import { AjaxRequest, AjaxResponse } from "rxjs/ajax";
import { ServerConfig } from "@nteract/types";

export const normalizeBaseURL = (url = "") => url.replace(/\/+$/, "");

/**
 * Creates an AJAX request to connect to a given server. This function
 * handles setting the authorization tokens on the request.
 *
 * @param serverConfig Details about the server to connect to.
 * @param uri The URL to connect to, not including the base URL
 * @param opts A set of options to pass to the AJAX request. We mimic jquery.ajax support of a cache option here.
 *
 * @returns A fully-configured AJAX request for connecting to the server.
 */
export const createAJAXSettings = (
  serverConfig: ServerConfig,
  uri = "/",
  opts: Partial<AjaxRequest & { cache?: boolean }> = {}
): AjaxRequest => {
  const baseURL = normalizeBaseURL(serverConfig.endpoint || serverConfig.url);
  let url = `${baseURL}${uri}`;
  if (opts.cache === false) {
    const parsed = new URL(url);
    parsed.searchParams.set("_", Date.now().toString());
    url = parsed.href;
  }

  const {
    ajaxOptions,
    // We no longer need the endpoint property so we're plucking it off here
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    endpoint,
    ...remainingServerConfig
  } = serverConfig;

  // Use the server config provided token if available before trying cookies
  const xsrfToken = serverConfig.xsrfToken || Cookies.get("_xsrf");

  const headers = Object.assign(
    {} as { [name: string]: string },
    opts.headers,
    ajaxOptions?.headers as {}
  );
  if (xsrfToken) {
    headers["X-XSRFToken"] = xsrfToken;
  }
  if (serverConfig.token) {
    headers["Authorization"] = `token ${serverConfig.token}`;
  }

  // Merge in our typical settings for responseType, allow setting additional
  // options like the method
  const settings = {
    url,
    responseType: "json",
    createXHR: () => new XMLHttpRequest(),
    ...remainingServerConfig,
    ...ajaxOptions,
    ...opts,
    // Make sure we merge in the auth headers with user given headers
    headers,
  };

  delete settings.cache;
  return settings;
};

/**
 * RxJS's AjaxResponse sets `response` as any when we can declare the type returned.
 *
 * This interface is meant to be internal, used as:
 *
 * ```
   ajax('/api/contents') as Observable<JupyterAjaxResponse<Contents>>
   ```
 * or as
 * ```
   ajax('/api/contents').map(resp => {
     if(resp.response.type === "notebook")
   })
   ```
 *
 * NOTE: the response can still be invalid and should likely be validated
 */
export interface JupyterAjaxResponse<ResponseType, ErrorType = string>
  extends AjaxResponse {
  response: ResponseType | ErrorType;
}
