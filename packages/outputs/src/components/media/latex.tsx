import * as React from "react";
import * as MathJax from "@nteract/mathjax";

interface Props {
  data: string;
  mediaType: "text/latex";
}

export class LaTeX extends React.PureComponent<Props> {
  static defaultProps = {
    data: "",
    mediaType: "text/latex"
  };

  render() {
    return <MathJax.Text>{this.props.data}</MathJax.Text>;
  }
}
