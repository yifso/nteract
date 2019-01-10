import * as React from "react";
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
      error,
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
              error={error}
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

const makeMapStateToProps = (
  initialState: AppState,
  initialProps: { contentRef: ContentRef }
) => {
  const host = initialState.app.host;
  if (host.type !== "jupyter") {
    throw new Error("this component only works with jupyter apps");
  }
  const appBase = urljoin(host.basePath, "/nteract/edit");

  const mapStateToProps = (state: AppState) => {
    const contentRef = initialProps.contentRef;
    const comms = selectors.communication(state, initialProps);

    if (!comms) {
      throw new Error("CommunicationByRef information not found");
    }

    if (!contentRef) {
      throw new Error("cant display without a contentRef");
    }

    const content = selectors.content(state, { contentRef });

    if (!content) {
      throw new Error("need content to view content, check your contentRefs");
    }

    return {
      appBase,
      contentRef,
      baseDir: dirname(content.filepath),
      contentType: content.type,
      displayName: content.filepath.split("/").pop(),
      error: comms.error,
      lastSavedStatement: "recently",
      loading: comms.loading,
      mimetype: content.mimetype,
      saving: comms.saving
    };
  };
  return mapStateToProps;
};

export default connect(makeMapStateToProps)(Contents);
