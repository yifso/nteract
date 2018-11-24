import { deepFreeze } from "./freeze";

// Straight from nbformat
export type MultilineString = string | Array<string>;

export interface OnDiskMimebundle {
  "text/plain": MultilineString | {} | undefined;
  "text/html": MultilineString | {} | undefined;
  "text/latex": MultilineString | {} | undefined;
  "text/markdown": MultilineString | {} | undefined;
  "application/javascript": MultilineString | {} | undefined;
  "image/png": MultilineString | {} | undefined;
  "image/jpeg": MultilineString | {} | undefined;
  "image/gif": MultilineString | {} | undefined;
  "image/svg+xml": MultilineString | {} | undefined;

  // The JSON mimetype has some corner cases because of the protocol / format assuming the values
  // in a mimebundle are either:
  //
  //   * A string; which would be deserialized
  //   * An array; which would have to be assumed to be a multiline string
  //
  "application/json": string | Array<string> | {} | undefined;
  "application/vdom.v1+json": {} | undefined;
  "application/vnd.dataresource+json": {} | undefined;
  "text/vnd.plotly.v1+html": MultilineString | {} | undefined;
  "application/vnd.plotly.v1+json": {} | undefined;
  "application/geo+json": {} | undefined;
  "application/x-nteract-model-debug+json": {} | undefined;
  "application/vnd.vega.v2+json": {} | undefined;
  "application/vnd.vega.v3+json": {} | undefined;
  "application/vnd.vegalite.v1+json": {} | undefined;
  "application/vnd.vegalite.v2+json": {} | undefined;

  [key: string]: string | Array<string> | {} | undefined | undefined;
};

// Enumerating over all the media types we currently accept
export interface MediaBundle {
  "text/plain": string | {} | undefined;
  "text/html": string | {} | undefined;
  "text/latex": string | {} | undefined;
  "text/markdown": string | {} | undefined;
  "application/javascript": string | {} | undefined;
  "image/png": string | {} | undefined;
  "image/jpeg": string | {} | undefined;
  "image/gif": string | {} | undefined;
  "image/svg+xml": string | {} | undefined;
  "application/json": {} | undefined;
  "application/vdom.v1+json": {} | undefined;
  "application/vnd.dataresource+json": {} | undefined;
  "text/vnd.plotly.v1+html": string | {} | undefined;
  "application/vnd.plotly.v1+json": {} | undefined;
  "application/geo+json": {} | undefined;
  "application/x-nteract-model-debug+json": {} | undefined;
  "application/vnd.vega.v2+json": {} | undefined;
  "application/vnd.vega.v3+json": {} | undefined;
  "application/vnd.vegalite.v1+json": {} | undefined;
  "application/vnd.vegalite.v2+json": {} | undefined;
  [key: string]: string | Array<string> | {} | undefined; // all others
};

export type MimeBundle = Partial<MediaBundle>;

/**
 * Turn nbformat multiline strings (arrays of strings for simplifying diffs) into strings
 */
export function demultiline(s: string | Array<string>): string {
  if (Array.isArray(s)) {
    return s.join("");
  }
  return s;
}

/**
 * Split string into a list of strings delimited by newlines; useful for on-disk git comparisons;
 * and is the expectation for jupyter notebooks on disk
 */
export function remultiline(s: string | Array<string>): Array<string> {
  if (Array.isArray(s)) {
    // Assume
    return s;
  }
  // Use positive lookahead regex to split on newline and retain newline char
  return s.split(/(.+(:\r\n|\n))/g).filter(x => x !== "");
}

function isJSONKey(key: string) {
  return /^application\/(.*\+)json$/.test(key);
}

export function createImmutableMimeBundle(
  mimeBundle: OnDiskMimebundle
): MimeBundle {
  // Map over all the mimetypes; turning them into our in-memory format
  //
  // {
  //   "application/json": {"a": 3; "b": 2};
  //   "text/html": ["<p>\n"; "Hey\n"; "</p>"];
  //   "text/plain": "Hey"
  // }
  //
  // to
  //
  // {
  //   "application/json": {"a": 3; "b": 2};
  //   "text/html": "<p>\nHey\n</p>";
  //   "text/plain": "Hey"
  // }

  // Since we have to convert from one type to another that has conflicting types; we need to hand convert it in a way that
  // flow is able to verify correctly. The way we do that is create a new object that we declare with the type we want;
  // set the keys and values we need; then seal the object with Object.freeze
  const bundle: MimeBundle = {};

  for (const key in mimeBundle) {
    if (
      !isJSONKey(key) &&
      (typeof mimeBundle[key] === "string" || Array.isArray(mimeBundle[key]))
    ) {
      // Because it's a string; we can't mutate it anyways (and don't have to Object.freeze it)
      bundle[key] = demultiline(mimeBundle[key] as MultilineString);
    } else {
      // we now know it's an Object of some kind
      bundle[key] = deepFreeze(mimeBundle[key]!);
    }
  }

  return Object.freeze(bundle);
}