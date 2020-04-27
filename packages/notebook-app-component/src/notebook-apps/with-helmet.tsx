import React from "react";

import { ContentRef } from "@nteract/core";
import NotebookHelmet from "../decorators/notebook-helmet";
import DraggableNotebook from "./draggable-with-cell-creator";

interface ComponentProps {
  contentRef: ContentRef;
}

export default (props: ComponentProps) => (
  <React.Fragment>
    <NotebookHelmet contentRef={props.contentRef} />
    <DraggableNotebook contentRef={props.contentRef} />
  </React.Fragment>
);
