import { promisify } from "util";
import { Result } from "vega-embed";
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
): Promise<Result | void> {
  const version = MEDIA_TYPES[mediaType];
  const defaults = {
    actions: false,
    mode: version.kind,
  };

  switch (version.vegaLevel) {
    case 2:
      return await import("@nteract/vega-embed-v2").then(
        ({ default: vegaEmbed }) =>
          promisify(vegaEmbed)(anchor, {...defaults, ...options, spec: JSON.parse(spec)})
      );

    case 3:
      return await import("@nteract/vega-embed-v3").then(
        ({ default: vegaEmbed }) =>
          vegaEmbed(anchor, JSON.parse(spec), {...defaults, ...options})
      );

    case 4:
    case 5:
      return await import("vega-embed").then(
        ({ default: vegaEmbed }) =>
          vegaEmbed(anchor, JSON.parse(spec), {...defaults, ...options})
      );
  }
}
