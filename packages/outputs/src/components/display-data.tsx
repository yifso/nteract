import * as React from "react";

import { MediaBundle } from "@nteract/commutable";

import { RichMedia } from "./rich-media";

interface Props {
  /**
   * The literal type of output, used for routing with the `<Output />` element
   */
  output_type: "display_data";
  /**
   * Object of media type → data
   *
   * E.g.
   *
   * ```js
   * {
   *   "text/plain": "raw text",
   * }
   * ```
   *
   * See [Jupyter message spec](http://jupyter-client.readthedocs.io/en/stable/messaging.html#display-data)
   * for more detail.
   *
   */
  data: MediaBundle;
  /**
   * custom settings, typically keyed by media type
   */
  metadata: {};
  /**
   * React elements that accept media bundle data, will get passed data[mimetype]
   */
  children: React.ReactNode;
}

export const DisplayData = (props: Props) => {
  const { data, metadata, children } = props;

  return (
    <RichMedia data={data} metadata={metadata}>
      {children}
    </RichMedia>
  );
};

DisplayData.defaultProps = {
  output_type: "display_data",
  data: {},
  metadata: {}
};
