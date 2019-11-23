import Immutable from "immutable";
import React from "react";

import { ContentRef } from "@nteract/core";
import { Media, KernelOutputError, StreamText } from "@nteract/outputs";
import { Source, Input, Prompt } from "@nteract/presentational-components";
import CodeMirrorEditor from "@nteract/editor";

import Editor from "../inputs/editor";
import TransformMedia from "../outputs/transform-media";
import Outputs from "../outputs";
import Pagers from "../outputs/pagers";

interface ComponentProps {
  id: string;
  contentRef: ContentRef;
  cell: Immutable.Map<string, any>;
  cell_type: "code";
}

export default class CodeCell extends React.Component<ComponentProps> {
  static defaultProps = {
    cell_type: "code"
  };

  render() {
    const { id, contentRef } = this.props;

    return (
      <div className="nteract-code-cell">
        <Input>
          <Prompt id={id} contentRef={contentRef} />
          <Source>
            <Editor id={id} contentRef={contentRef}>
              <CodeMirrorEditor />
            </Editor>
          </Source>
        </Input>
        <Pagers id={id} contentRef={contentRef}>
          <Media.Json />
          <Media.JavaScript />
          <Media.HTML />
          <Media.Markdown />
          <Media.LaTeX />
          <Media.SVG />
          <Media.Image />
          <Media.Plain />
        </Pagers>
        <Outputs id={id} contentRef={contentRef}>
          <TransformMedia
            output_type={"display_data"}
            id={id}
            contentRef={contentRef}
          />
          <TransformMedia
            output_type={"execute_result"}
            id={id}
            contentRef={contentRef}
          />
          <KernelOutputError />
          <StreamText />
        </Outputs>
        {/* <InputPrompts id={id} contentRef={contentRef} /> */}
      </div>
    );
  }
}
