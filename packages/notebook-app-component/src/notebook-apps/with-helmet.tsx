import React from "react";

import { ContentRef } from "@nteract/core";

import NotebookHelmet from "../decorators/notebook-helmet";
import DraggableNotebook from "./draggable-with-cell-creator";

import AppCommandPalette from "./app-command-palette";
interface ComponentProps {
  contentRef: ContentRef;
}

export default class extends React.Component<ComponentProps> {
  state = { isVisible: false };
  render() {
    const { props } = this;
    return (
      <React.Fragment>
        <AppCommandPalette isVisible={this.state.isVisible} />
        <button
          onClick={() => {
            this.setState({ isVisible: true });
          }}
        >
          Show Palette
        </button>
        <NotebookHelmet contentRef={props.contentRef} />
        <DraggableNotebook contentRef={props.contentRef} />
      </React.Fragment>
    );
  }
}
// export default (props: ComponentProps) => (
//   <React.Fragment>
//     <AppCommandPalette isVisible={false} />
//     <NotebookHelmet contentRef={props.contentRef} />
//     <DraggableNotebook contentRef={props.contentRef} />
//   </React.Fragment>
// );
