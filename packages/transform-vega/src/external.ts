import { vega, vegaLite } from "any-vega";

import { MEDIA_TYPES, VegaMediaType } from "./mime";

export interface VegaOptions {
  renderer: "canvas" | "svg";
}

/** Call the external library to do the embedding. */
export async function embed(
  anchor: HTMLElement,
  mediaType: VegaMediaType,
  spec: string,
  options: Partial<VegaOptions> = {},
): Promise<any> {
  const version = MEDIA_TYPES[mediaType];
  const defaults = {
    actions: false,
    mode: version.kind,
  };
  let vegaEmbed: any;

  switch (version.kind) {
    case "vega":
      switch (version.version) {
        case "2": vegaEmbed = vega.v2; break;
        case "3": vegaEmbed = vega.v3; break;
        case "4": vegaEmbed = vega.v4; break;
        case "5": vegaEmbed = vega.v5; break;
        default: vegaEmbed = vega.v5;
      }
      break;
    case "vega-lite":
      switch (version.version) {
        case "1": vegaEmbed = vegaLite.v1; break;
        case "2": vegaEmbed = vegaLite.v2; break;
        case "3": vegaEmbed = vegaLite.v3; break;
        case "4": vegaEmbed = vegaLite.v4; break;
        default: vegaEmbed = vegaLite.v4;
      }
      break;
  }

  return vegaEmbed(anchor, JSON.parse(spec), {...options, ...defaults});
}
