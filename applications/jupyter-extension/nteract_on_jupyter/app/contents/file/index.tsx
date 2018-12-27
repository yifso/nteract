import { dirname } from "path";

import * as React from "react";
import styled from "styled-components";
import { Dispatch } from "redux";
import { selectors } from "@nteract/core";
import { ContentRef, AppState } from "@nteract/core";
import { LoadingIcon, SavingIcon, ErrorIcon } from "@nteract/iron-icons";
import { connect } from "react-redux";
// $FlowFixMe
import * as actions from "@nteract/actions";

import { ThemedLogo } from "../../components/themed-logo";
import { Nav, NavSection } from "../../components/nav";
import LastSaved from "../../components/last-saved";
import { default as Notebook } from "../notebook";

import * as TextFile from "./text-file";

const urljoin = require("url-join");

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
};

type State = { isDialogOpen: boolean };

export class File extends React.PureComponent<FileProps, State> {
  constructor(props: FileProps) {
    super(props);

    this.state = { 
      isDialogOpen: false 
    };
  };

  // Determine the file handler
  getFileHandlerIcon = () => {
    return this.props.saving ? (
      <SavingIcon />
    ) : this.props.error ? (
      <ErrorIcon />
    ) : this.props.loading ? (
      <LoadingIcon />
    ) : (
      ""
    );
  }

  // TODO: Add more acceptable file extensions
  hasFileExtension = (fileName: string) => {
    if (/\.ipynb/.exec(fileName) !== null) {
      return true;
    } else {
      return false;
    }
  }

  // TODO: Add logic for acceptable file extensions
  addFileExtension = (fileName: string) => {
    if (!this.hasFileExtension(fileName)) {
      return `${fileName}.ipynb`;
    } else {
      return fileName;
    }
  }

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
  }

  // Handles onConfirm callback for EditableText component
  confirmTitle = (value: string) => {
    if (value !== this.props.displayName) {
      // $FlowFixMe
      this.props.changeContentName({
        filepath: `/${value ? this.addFileExtension(value) : ""}`,
        prevFilePath: `/${this.props.displayName}`,
        contentRef: this.props.contentRef
      });
    }

    this.setState({ isDialogOpen: false });
  }

  render() {
    const icon = this.getFileHandlerIcon();
    const choice = this.getChoice();

    // Right now we only handle one kind of editor
    // If/when we support more modes, we would case them off here
    return (
      <React.Fragment>
        <JupyterExtensionContainer>
          <Nav contentRef={this.props.contentRef}>
            <NavSection>
              <a
                href={urljoin(this.props.appBase, this.props.baseDir)}
                title="Home"
              >
                <ThemedLogo />
              </a>
              <div>
                <H4 onClick={() => this.setState({ isDialogOpen: true })}>
                  {this.props.displayName}
                </H4>
                <EditableTitleOverlay 
                  defaultValue={this.props.displayName}
                  isOpen={this.state.isDialogOpen}
                  onCancel={() => this.setState({ isDialogOpen: false })}
                  onSave={this.confirmTitle}
                />
              </div>
            </NavSection>
            <NavSection>
              <span className="icon">{icon}</span>
              <LastSaved contentRef={this.props.contentRef} />
            </NavSection>
          </Nav>
          <JupyterExtensionChoiceContainer>
            {choice}
          </JupyterExtensionChoiceContainer>
        </JupyterExtensionContainer>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (
  state: AppState,
  ownProps: { 
    contentRef: ContentRef, 
    appBase: string
  }): FileProps => {
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

  // $FlowFixMe
  return {
    type: content.type,
    mimetype: content.mimetype,
    contentRef: ownProps.contentRef,
    lastSavedStatement: "recently",
    appBase: ownProps.appBase,
    baseDir: dirname(content.filepath),
    displayName: content.filepath.split("/").pop(),
    saving: comms.saving,
    loading: comms.loading,
    error: comms.error
  };
};

const mapDispatchToProps = (dispatch: Dispatch<*>) => ({
    // $FlowFixMe
    changeContentName: (payload) => dispatch(actions.changeContentName(payload))
});

export const ConnectedFile = connect(
  mapStateToProps,
  mapDispatchToProps
)(File);

export default ConnectedFile;
