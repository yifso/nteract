import Ansi from "ansi-to-react";
import React from "react";

interface Props {
  data: string;
  mediaType: "text/plain";
}

export default class TextDisplay extends React.PureComponent<Props> {
  static MIMETYPE = "text/plain";

  static defaultProps = {
    data: "",
    mediaType: "text/plain"
  };

  render() {
    return (
      <pre>
        <Ansi linkify={false}>{this.props.data}</Ansi>
      </pre>
    );
  }
}
