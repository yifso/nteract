import { promisify } from "util";
import { MEDIA_TYPES, VegaMediaType } from "./mime";

export interface VegaOptions {
  renderer: "canvas" | "svg";
}

/** Call the external library to do the embedding. */
export async function doEmbedding(
  anchor: HTMLElement,
  mediaType: VegaMediaType,
  spec: Readonly<{}>,
  options: Partial<VegaOptions> = {},
): Promise<any> {
  const version = MEDIA_TYPES[mediaType];
  const defaults = {
    actions: false,
    mode: version.kind,
  };

  if (version.vegaLevel <= 2) {
    return await import("@nteract/vega-embed-v2").then(
      ({ default: vegaEmbed }) =>
        promisify(vegaEmbed)(anchor, { ...defaults, ...options, spec })
    );
  }
  else if (version.vegaLevel <= 3) {
    return await import("@nteract/vega-embed-v3").then(
      ({ default: vegaEmbed }) =>
        vegaEmbed(anchor, deepThaw(spec), {...defaults, ...options})
    );
  }
  else {
    return await import("vega-embed").then(
      ({ default: vegaEmbed }) =>
        vegaEmbed(anchor, deepThaw(spec), {...defaults, ...options})
    );
  }
}

function deepThaw(spec: Readonly<{}>): {} {
  return JSON.parse(JSON.stringify(spec));
}
