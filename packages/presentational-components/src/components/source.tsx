import * as React from "react";

import Highlighter from "../syntax-highlighter";
import styled from "styled-components";

export type SourceProps = {
  language: string;
  children: React.ReactNode;
  className: string;
  theme: "light" | "dark";
};

class BareSource extends React.Component<SourceProps> {
  static defaultProps = {
    children: "",
    language: "text",
    className: "input",
    theme: "light"
  };

  render() {
    // Build in a default renderer when they pass a plain string
    // This is primarily for use with non-editable contexts (notebook-preview)
    // to make rendering much faster (compared to codemirror)
    // Ref: https://github.com/nteract/notebook-preview/issues/20
    if (typeof this.props.children === "string") {
      return (
        <Highlighter
          language={this.props.language}
          className={this.props.className}
        >
          {this.props.children}
        </Highlighter>
      );
    }
    // Otherwise assume they have their own editor component
    return <div className={this.props.className}>{this.props.children}</div>;
  }
}

export const Source = styled(BareSource)``;
