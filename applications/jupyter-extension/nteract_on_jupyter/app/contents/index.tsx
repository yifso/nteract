// NOTE: We can safely install and use react-hot-loader as a regular dependency
// instead of a dev dependency as it automatically ensures it is not executed
// in production and the footprint is minimal.
import * as React from "react";
import { hot } from "react-hot-loader";
import { connect } from "react-redux";
import { selectors, AppState, ContentRef } from "@nteract/core";
import { LoadingIcon, SavingIcon, ErrorIcon } from "@nteract/iron-icons";
import { H4 } from "@blueprintjs/core";
import urljoin from "url-join";

import { ConnectedDirectory } from "./directory";
import { EditableTitleOverlay } from "../components/editable-title-overlay";
import { ThemedLogo } from "../components/themed-logo";
import { Nav, NavSection } from "../components/nav";
import LastSaved from "../components/last-saved";
import { default as File } from "./file";

type ContentsProps = {
  contentType: "dummy" | "notebook" | "directory" | "file";
  contentRef: ContentRef;
  appBase: string;
};

type ContentsState = {
  isDialogOpen: boolean;
};

const mapStateToProps = (
  state: AppState,
  ownProps: { contentRef: ContentRef }
): ContentsProps => {
  const contentRef = ownProps.contentRef;
  const host = state.app.host;
  if (host.type !== "jupyter") {
    throw new Error("this component only works with jupyter apps");
  }

  if (!contentRef) {
    throw new Error("cant display without a contentRef");
  }

  const content = selectors.content(state, { contentRef });
  if (!content) {
    throw new Error("need content to view content, check your contentRefs");
  }

  return {
    appBase: urljoin(host.basePath, "/nteract/edit"),
    contentRef,
    contentType: content.type
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  changeContentName: (payload: actions.ChangeContentName["payload"]) =>
    dispatch(actions.changeContentName(payload))
});

class Contents extends React.PureComponent<ContentsProps, ContentsState> {
  constructor(props: ContentsProps) {
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
    const appBase = this.props.appBase;
    const icon = this.getFileHandlerIcon();

    switch (this.props.contentType) {
      case "notebook":
      case "file":
      case "dummy":
        const themeLogoLink = urljoin(this.props.appBase, this.props.baseDir);

        return (
          <React.Fragment>
            <Nav>
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
            <File contentRef={this.props.contentRef} appBase={appBase} />;
          </React.Fragment>
        );
      case "directory":
        return (
          <React.Fragment>
            <Nav>
              <NavSection>
                <a
                  href={urljoin(this.props.appBase)}
                  title="Home"
                  role="button"
                >
                  <ThemedLogo />
                </a>
                <span>{this.props.content.filepath.split("/").pop()}</span>
              </NavSection>
            </Nav>
            <ConnectedDirectory
              contentRef={this.props.contentRef}
              appBase={appBase}
            />
          </React.Fragment>
        );
      default:
        return (
          <React.Fragment>
            <Nav>
              <NavSection>
                <a href={urljoin(this.props.appBase)} title="Home">
                  <ThemedLogo />
                </a>
              </NavSection>
            </Nav>
            <div>
              {`content type ${this.props.contentType} not implemented`}
            </div>
          </React.Fragment>
        );
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(hot(module)(Contents));
