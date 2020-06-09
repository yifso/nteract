import React from "react";

import { ContentRef } from "@nteract/core";

import NotebookHelmet from "../decorators/notebook-helmet";
import DraggableNotebook from "./draggable-with-cell-creator";
import { GlobalHotKeys, KeyMap, configure } from "react-hotkeys";
import AppCommandPalette from "./app-command-palette";

configure({
  ignoreTags: [],
});
import AppToolbar from "./app-toolbar";
interface ComponentProps {
  contentRef: ContentRef;
}

interface ComponentState {
  isCommandPaletteVisible: boolean;
}

const keymap: KeyMap = {
  SHOW_COMMAND_PALETTE: ["ctrl+p", "meta+p"],
};

export default class extends React.PureComponent<
  ComponentProps,
  ComponentState
> {
  state: ComponentState = { isCommandPaletteVisible: false };

  showPalette = () => {
    this.setState((previous) => ({
      isCommandPaletteVisible: !previous.isCommandPaletteVisible,
    }));
  };

  render() {
    const handlers = {
      SHOW_COMMAND_PALETTE: this.showPalette,
    };

    const { props } = this;
    return (
      <React.Fragment>
        <AppToolbar contentRef={props.contentRef} />
        <GlobalHotKeys keyMap={keymap} handlers={handlers} />
        <AppCommandPalette
          contentRef={props.contentRef}
          isVisible={this.state.isCommandPaletteVisible}
          onToggleVisibility={this.showPalette}
        />
        <NotebookHelmet contentRef={props.contentRef} />
        <DraggableNotebook contentRef={props.contentRef} />
      </React.Fragment>
    );
  }
}
