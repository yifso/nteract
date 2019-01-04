import * as React from "react";
import styled from "styled-components";
import { dirname } from "path";
import { Dispatch } from "redux";
import { ContentRef, AppState, selectors } from "@nteract/core";
import { connect } from "react-redux";
import * as actions from "@nteract/actions";

import { default as Notebook } from "../notebook";
import * as TextFile from "./text-file";

const PaddedContainer = styled.div`
  padding-left: var(--nt-spacing-l, 10px);
  padding-top: var(--nt-spacing-m, 10px);
  padding-right: var(--nt-spacing-m, 10px);
`;

const JupyterExtensionContainer = styled.div`
  display: flex;
  flex-flow: column;
  align-items: stretch;
  height: -webkit-fill-available;
`;

const JupyterExtensionChoiceContainer = styled.div`
  flex: 1 1 auto;
  overflow: auto;
`;

type FileProps = {
  type: "notebook" | "file" | "dummy";
  contentRef: ContentRef;
  baseDir: string;
  appBase: string;
  displayName?: string;
  mimetype?: string | null;
  lastSavedStatement: string;
  saving: boolean;
  loading: boolean;
  error?: object | null;
  changeContentName: (payload: actions.ChangeContentName["payload"]) => void;
};

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
      // TODO: Redirect to /files/ endpoint for them to download the file or view
      //       as is
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

  render() {
    const choice = this.getChoice();

    // Right now we only handle one kind of editor
    // If/when we support more modes, we would case them off here
    return (
      <React.Fragment>
        <JupyterExtensionContainer>{choice}</JupyterExtensionContainer>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (
  state: AppState,
  ownProps: {
    contentRef: ContentRef;
    appBase: string;
  }
) => {
  const content = selectors.content(state, ownProps);

  if (!content || content.type === "directory") {
    throw new Error(
      "The file component should only be used with files and notebooks"
    );
  }

  const comms = selectors.communication(state, ownProps);
  if (!comms) {
    throw new Error("CommunicationByRef information not found");
  }

  return {
    appBase: ownProps.appBase,
    baseDir: dirname(content.filepath),
    contentRef: ownProps.contentRef,
    displayName: content.filepath.split("/").pop(),
    error: comms.error,
    lastSavedStatement: "recently",
    loading: comms.loading,
    mimetype: content.mimetype,
    saving: comms.saving,
    type: content.type
  };
};

export const ConnectedFile = connect(mapStateToProps)(File);

export default ConnectedFile;
