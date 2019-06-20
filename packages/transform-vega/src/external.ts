import vegaEmbedV2 from "@nteract/vega-embed-v2";
import vegaEmbedV3 from "@nteract/vega-embed-v3";
import { promisify } from "util";
import vegaEmbedV4 from "vega-embed";
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
    await promisify(vegaEmbedV2)(anchor, {...defaults, ...options, spec});
  }
  else if (version.vegaLevel <= 3) {
    await vegaEmbedV3(anchor, deepThaw(spec), {...defaults, ...options});
  }
  else {
    await vegaEmbedV4(anchor, deepThaw(spec), {...defaults, ...options} as {});
  }
}

function deepThaw(spec: Readonly<{}>): {} {
  return JSON.parse(JSON.stringify(spec));
}
