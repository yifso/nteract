import { ContentRef } from "@nteract/core";
import React from "react";

import Cells from "./cells/cells";
import CodeCell from "./cells/code-cell";
import MarkdownCell from "./cells/markdown-cell";
import RawCell from "./cells/raw-cell";
import CellToolbar, { CellToolbarContext } from "./cells/toolbar";
import StatusBar, { StatusBarContext } from "./notebook/status-bar";

export {
  Cells,
  CodeCell,
  MarkdownCell,
  RawCell,
  CellToolbar,
  CellToolbarContext,
  StatusBar,
  StatusBarContext
};

interface ComponentProps {
  contentRef: ContentRef;
}

export default class Notebook extends React.PureComponent<ComponentProps> {
  render(): JSX.Element {
    return <Cells contentRef={this.props.contentRef} />;
  }
}
