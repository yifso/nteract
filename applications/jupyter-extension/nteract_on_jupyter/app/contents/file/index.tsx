import { dirname } from "path";

import * as React from "react";
import styled from "styled-components";
import { Dispatch } from "redux";
import { ContentRef, AppState, selectors } from "@nteract/core";
import { LoadingIcon, SavingIcon, ErrorIcon } from "@nteract/iron-icons";
import { connect } from "react-redux";
import { H4 } from "@blueprintjs/core";
import * as actions from "@nteract/actions";

import { ThemedLogo } from "../../components/themed-logo";
import { Nav, NavSection } from "../../components/nav";
import LastSaved from "../../components/last-saved";
import { EditableTitleOverlay } from "../file/editable-title-overlay";
import { default as Notebook } from "../notebook";

import * as TextFile from "./text-file";
import { ActionsObservable } from "redux-observable";

import urljoin from "url-join";

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

interface IFileProps {
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
}

interface IState {
  isDialogOpen: boolean;
}

export class File extends React.PureComponent<IFileProps, IState> {
  constructor(props: IFileProps) {
    super(props);

    this.state = {
      isDialogOpen: false
    };
  }

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
  };

  // TODO: Add more acceptable file extensions
  hasFileExtension = (fileName: string) => {
    if (/\.ipynb/.exec(fileName) !== null) {
      return true;
    } else {
      return false;
    }
  };

  // TODO: Add logic for acceptable file extensions
  addFileExtension = (fileName: string) => {
    if (!this.hasFileExtension(fileName)) {
      return `${fileName}.ipynb`;
    } else {
      return fileName;
    }
  };

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

  // Handles onConfirm callback for EditableText component
  confirmTitle = (value: string) => {
    if (value !== this.props.displayName) {
      this.props.changeContentName({
        contentRef: this.props.contentRef,
        filepath: `/${value ? this.addFileExtension(value) : ""}`,
        prevFilePath: `/${this.props.displayName}`
      });
    }

    this.setState({ isDialogOpen: false });
  };

  openDialog = () => this.setState({ isDialogOpen: true });
  closeDialog = () => this.setState({ isDialogOpen: false });

  render() {
    const icon = this.getFileHandlerIcon();
    const choice = this.getChoice();
    const themeLogoLink = urljoin(this.props.appBase, this.props.baseDir);

    // Right now we only handle one kind of editor
    // If/when we support more modes, we would case them off here
    return (
      <React.Fragment>
        <JupyterExtensionContainer>
          <Nav contentRef={this.props.contentRef}>
            <NavSection>
              <a href={themeLogoLink} title="Home">
                <ThemedLogo />
              </a>
              <div>
                <H4 onClick={this.openDialog}>{this.props.displayName}</H4>
                <EditableTitleOverlay
                  defaultValue={this.props.displayName}
                  isOpen={this.state.isDialogOpen}
                  onCancel={this.closeDialog}
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

const mapDispatchToProps = (dispatch: Dispatch) => ({
  changeContentName: (payload: actions.ChangeContentName["payload"]) =>
    dispatch(actions.changeContentName(payload))
});

export const ConnectedFile = connect(
  mapStateToProps,
  mapDispatchToProps
)(File);

export default ConnectedFile;
