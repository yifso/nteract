import { AppState, ContentRef, selectors } from "@nteract/core";
import { dirname } from "path";
import * as React from "react";
import { connect } from "react-redux";
import styled from "styled-components";

import { default as Notebook } from "../notebook";
import * as TextFile from "./text-file";

const PaddedContainer = styled.div`
  padding-left: var(--nt-spacing-l, 10px);
  padding-top: var(--nt-spacing-m, 10px);
  padding-right: var(--nt-spacing-m, 10px);
`;

const ContentContainer = styled.div`
  display: flex;
  flex-flow: column;
  align-items: stretch;
  height: -webkit-fill-available;
`;

const ContentChoiceContainer = styled.div`
  flex: 1 1 auto;
  overflow: auto;
`;

interface FileProps {
  type: "notebook" | "file" | "dummy";
  contentRef: ContentRef;
  baseDir: string;
  displayName?: string;
  mimetype?: string | null;
}

export class File extends React.PureComponent<FileProps> {
  getChoice = () => {
    let choice = null;

    // notebooks don't report a mimetype so we'll use the content.type
    if (this.props.type === "notebook") {
      choice = <Notebook contentRef={this.props.contentRef} />;
    } else if (this.props.type === "dummy") {
      choice = null;
    } else if (
      this.props.mimetype == null ||
      !TextFile.handles(this.props.mimetype)
    ) {
      choice = (
        <PaddedContainer>
          <pre>Can not render this file type</pre>
        </PaddedContainer>
      );
    } else {
      choice = <TextFile.default contentRef={this.props.contentRef} />;
    }

    return choice;
  };

  render(): JSX.Element {
    const choice = this.getChoice();

    return (
      <React.Fragment>
        <ContentContainer>
          <ContentChoiceContainer>{choice}</ContentChoiceContainer>
        </ContentContainer>
      </React.Fragment>
    );
  }
}

interface InitialProps {
  contentRef: ContentRef;
  appBase: string;
}

const mapStateToProps = (state: AppState, initialProps: InitialProps) => {
  const { contentRef } = initialProps;

  let baseDir = "";
  let displayName = "";
  let mimetype = "";
  let type = "dummy";

  const content = selectors.content(state, initialProps);

  if (content) {
    baseDir = dirname(content.filepath);
    displayName = content.filepath.split("/").pop();
    mimetype = content.mimetype;
    type = content.type;
  }

  return {
    contentRef,
    baseDir,
    displayName,
    mimetype,
    type
  };
};

export default connect(mapStateToProps)(File);
