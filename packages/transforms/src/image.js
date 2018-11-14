/* @flow */
import React from "react";

type Props = {
  data: string,
  metadata: any,
  mediaType: "image/png" | "image/jpeg" | "image/gif"
};

export default function ImageDisplay(props: Props): ?React$Element<any> {
  let size = {};

  if (props.metadata) {
    const { width, height } = props.metadata;
    size = { width, height };
  }

  return (
    <React.Fragment>
      <img
        alt=""
        src={`data:${props.mediaType};base64,${props.data}`}
        {...size}
      />
      <style jsx>{`
        img {
          display: block;
          max-width: 100%;
        }
      `}</style>
    </React.Fragment>
  );
}

export class PNGDisplay extends React.PureComponent<Props> {
  static MIMETYPE = "image/png";

  static defaultProps = {
    data: "",
    mediaType: "image/png"
  };

  render() {
    return <ImageDisplay mediaType="image/png" {...this.props} />;
  }
}

export class JPEGDisplay extends React.PureComponent<Props> {
  static MIMETYPE = "image/jpeg";

  static defaultProps = {
    data: "",
    mediaType: "image/jpeg"
  };

  render() {
    return <ImageDisplay mediaType="image/jpeg" {...this.props} />;
  }
}

export class GIFDisplay extends React.PureComponent<Props> {
  static MIMETYPE = "image/gif";

  static defaultProps = {
    data: "",
    mediaType: "image/gif"
  };

  render() {
    return <ImageDisplay mediaType="image/gif" {...this.props} />;
  }
}
