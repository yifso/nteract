/**
 * Information about a particular Vega or Vega Lite version.
 *
 * kind string Either vega or vega-lite
 * version string Semantic version
 * mediaType string Exact mime-type
 * schemaPrefix string Prefix to check the $schema attribute against
 */
export interface VegaVersion<T extends string> {
  kind: "vega" | "vega-lite",
  version: string,
  mediaType: T,
  schemaPrefix: string,
}

/**
 * Props of the components that are exported.
 *
 * data object Parsed vega or vega-lite spec
 */
export interface VegaTransformProps {
  data: Readonly<object>;
}

/**
 * Props of the internal components.
 *
 * spec object Parsed vega or vega-lite spec
 * version VegaVersion Version of the spec supported
 * options VegaEmbeddingOptions How to do the embedding
 */
export interface VegaEmbedProps<T extends string> {
  spec: Readonly<object>;
  version: VegaVersion<T>;
  options: VegaEmbeddingOptions;
}

/**
 * React functional component embedding a certain media type.
 *
 * MIMETYPE string The media type handled by this component
 */
export interface VegaTransform<T extends string> {
  (props: VegaTransformProps): JSX.Element;
  MIMETYPE: T;
}

/**
 * Function to call the external library doing the embedding.
 *
 * el HTMLElement An empty DOM element for the embedder to extend
 * spec object Mutable copy of vega or vega-lite spec
 */
export type VegaEmbedder = (anchor: HTMLElement, spec: object) => Promise<any>;

/**
 * Embedder function together with its options.
 *
 * embedder VegaEmbedder Function calling the embedding library
 * prelude JSX.Element Optional JSX to insert before the anchor element
 */
export interface VegaEmbeddingOptions {
  embedder: VegaEmbedder;
  prelude?: JSX.Element;
}
