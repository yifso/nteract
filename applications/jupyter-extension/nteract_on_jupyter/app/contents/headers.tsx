import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import * as actions from "@nteract/actions";
import { NotebookMenu } from "@nteract/connected-components";
import { LoadingIcon, SavingIcon, ErrorIcon } from "@nteract/iron-icons";
import { ContentRef } from "@nteract/core";
import { H4 } from "@blueprintjs/core";
import urljoin from "url-join";

import { EditableTitleOverlay } from "../components/editable-title-overlay";
import { ThemedLogo } from "../components/themed-logo";
import { Nav, NavSection } from "../components/nav";
import LastSaved from "../components/last-saved";

/* Returns a header for the Directory view, which only consists of the Nav. */
export interface DirectoryHeaderProps {
  appBase: string;
}

export const DirectoryHeader: React.SFC<DirectoryHeaderProps> = props => (
  <Nav>
    <NavSection>
      {props.appBase ? (
        <a href={urljoin(props.appBase)} role="button" title="Home">
          <ThemedLogo />
        </a>
      ) : null}
    </NavSection>
  </Nav>
);

/* Returns a header for a Notebook/File/Dummy view, which consists of the Nav
 * and the NotebookMenu components.
 */
export interface FileHeaderProps {
  appBase: string;
  baseDir: string;
  changeContentName: (value: actions.ChangeContentName["payload"]) => {};
  contentRef: ContentRef;
  displayName?: string;
  error?: object | null;
  loading: boolean;
  saving: boolean;
}

export interface State {
  isDialogOpen: boolean;
}

class FileHeader extends React.PureComponent<FileHeaderProps, State> {
  constructor(props: FileHeaderProps) {
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

  openDialog = () => this.setState({ isDialogOpen: true });
  closeDialog = () => this.setState({ isDialogOpen: false });

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
  render() {
    const themeLogoLink = urljoin(this.props.appBase, this.props.baseDir);
    const icon = this.getFileHandlerIcon();

    return (
      <React.Fragment>
        <Nav>
          <NavSection>
            <a href={themeLogoLink} role="button" title="Home">
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
        <NotebookMenu contentRef={this.props.contentRef} />
      </React.Fragment>
    );
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  changeContentName: (payload: actions.ChangeContentName["payload"]) =>
    dispatch(actions.changeContentName(payload))
});

export const ConnectedFileHeader = connect(
  null,
  mapDispatchToProps
)(FileHeader);

export default ConnectedFileHeader;
