import * as React from "react";
import { VegaMediaType } from "./mime";
import { VegaEmbed } from "./react";

export const Vega = (mediaType: VegaMediaType) => {
  const embed = ({ data: spec }: { data: Readonly<{}> })  =>
    <VegaEmbed mediaType={mediaType} spec={spec} />;

  embed.MIMETYPE = mediaType;
  return embed;
};

export const Vega2 = Vega("application/vnd.vega.v2+json");
export const Vega3 = Vega("application/vnd.vega.v3+json");
export const Vega4 = Vega("application/vnd.vega.v4+json");
export const Vega5 = Vega("application/vnd.vega.v5+json");
export const VegaLite1 = Vega("application/vnd.vegalite.v1+json");
export const VegaLite2 = Vega("application/vnd.vegalite.v2+json");
export const VegaLite3 = Vega("application/vnd.vegalite.v3+json");
