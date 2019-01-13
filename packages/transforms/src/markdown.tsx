import Markdown from "@nteract/markdown";
import * as React from "react";

type Props = {
  data: string;
  mediaType: "text/markdown";
};

export default class MarkdownDisplay extends React.PureComponent<Props> {
  static MIMETYPE = "text/markdown";

  static defaultProps = {
    data: "",
    mediaType: "text/markdown"
  };

  render() {
    return <Markdown source={this.props.data} />;
  }
}
