import vegaEmbedV2 from "@nteract/vega-embed-v2";
import * as React from "react";
import { promisify } from "util";
import vegaEmbedV4 from "vega-embed";
import { VegaEmbeddingOptions } from "./types";

export const VEGA_EMBED_2: VegaEmbeddingOptions = {
  embedder: (anchor, spec) => promisify(vegaEmbedV2)(anchor, spec),
  prelude: <style>{".vega-actions { display: none; }"}</style>,
};

export const VEGA_EMBED_4: VegaEmbeddingOptions = {
  embedder: (anchor, spec) => vegaEmbedV4(anchor, spec, { actions: false }),
};
