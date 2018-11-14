/* @flow */
import * as React from "react";
import Markdown from "@nteract/markdown";

type Props = {
  data: string,
  mediaType: "text/markdown"
};

export class MarkdownDisplay extends React.Component<Props> {
  static MIMETYPE = "text/markdown";

  shouldComponentUpdate(nextProps: Props): boolean {
    return nextProps.data !== this.props.data;
  }
  static defaultProps = {
    data: "",
    mediaType: "text/markdown"
  };

  render(): ?React$Element<any> {
    return <Markdown source={this.props.data} />;
  }
}

export default MarkdownDisplay;
