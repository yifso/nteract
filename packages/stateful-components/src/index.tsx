import { ContentRef } from "@nteract/core";
import React from "react";

import Cells from "./cells/cells";
import CodeCell from "./cells/code-cell";
import MarkdownCell from "./cells/markdown-cell";
import RawCell from "./cells/raw-cell";
import CellToolbar, { CellToolbarContext } from "./cells/toolbar";
import StatusBar, { StatusBarContext } from "./notebook/status-bar";

import ThemeFromConfig from "./decorators/theme-from-config";
import {
  CommandContext,
  CommandContainerProps,
  DispatchProps as CommandDispatchProps,
  default as CommandContainer,
} from "./command-palette/command-palette";

export {
  Cells,
  CodeCell,
  MarkdownCell,
  RawCell,
  CellToolbar,
  CellToolbarContext,
  StatusBar,
  StatusBarContext,
  ThemeFromConfig,
  CommandContext,
  CommandContainerProps,
  CommandDispatchProps,
  CommandContainer,
};

export { userTheme } from "./config-options";

interface ComponentProps {
  contentRef: ContentRef;
}

export default class Notebook extends React.PureComponent<ComponentProps> {
  render(): JSX.Element {
    return <Cells contentRef={this.props.contentRef} />;
  }
}
