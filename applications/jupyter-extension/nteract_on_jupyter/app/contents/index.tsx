// NOTE: We can safely install and use react-hot-loader as a regular dependency
// instead of a dev dependency as it automatically ensures it is not executed
// in production and the footprint is minimal.
import * as React from "react";
import { hot } from "react-hot-loader";
import { connect } from "react-redux";
import { dirname } from "path";
import * as actions from "@nteract/actions";
import { AppState, ContentRef, selectors } from "@nteract/core";
import urljoin from "url-join";

import { ConnectedDirectory } from "./directory";
import { DirectoryHeader, ConnectedFileHeader as FileHeader } from "./headers";
import { default as File } from "./file";

interface IContentsProps {
  appBase: string;
  baseDir: string;
  changeContentName: (value: actions.ChangeContentName) => {};
  contentType: "dummy" | "notebook" | "directory" | "file";
  contentRef: ContentRef;
  displayName?: string;
  error?: object | null;
  lastSavedStatement: string;
  loading: boolean;
  mimetype?: string | null;
  saving: boolean;
}

interface IContentsState {
  isDialogOpen: boolean;
}

class Contents extends React.PureComponent<IContentsProps, IContentsState> {
  render() {
    const {
      appBase,
      baseDir,
      contentRef,
      contentType,
      displayName,
      loading,
      saving
    } = this.props;

    switch (contentType) {
      case "notebook":
      case "file":
      case "dummy":
        return (
          <React.Fragment>
            <FileHeader
              appBase={appBase}
              baseDir={baseDir}
              contentRef={contentRef}
              displayName={displayName}
              loading={loading}
              saving={saving}
            />
            <File contentRef={contentRef} appBase={appBase} />
          </React.Fragment>
        );
      case "directory":
        return (
          <React.Fragment>
            <DirectoryHeader appBase={appBase} />
            <ConnectedDirectory appBase={appBase} contentRef={contentRef} />
          </React.Fragment>
        );
      default:
        return (
          <React.Fragment>
            <DirectoryHeader appBase={appBase} />
            <div>{`content type ${contentType} not implemented`}</div>
          </React.Fragment>
        );
    }
  }
}

const mapStateToProps = (
  state: AppState,
  ownProps: { contentRef: ContentRef }
) => {
  const contentRef = ownProps.contentRef;
  const host = state.app.host;
  const comms = selectors.communication(state, ownProps);

  if (!comms) {
    throw new Error("CommunicationByRef information not found");
  }

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
    baseDir: dirname(content.filepath),
    contentRef,
    contentType: content.type,
    displayName: content.filepath.split("/").pop(),
    error: comms.error,
    lastSavedStatement: "recently",
    loading: comms.loading,
    mimetype: content.mimetype,
    saving: comms.saving
  };
};

export default connect(mapStateToProps)(hot(module)(Contents));
