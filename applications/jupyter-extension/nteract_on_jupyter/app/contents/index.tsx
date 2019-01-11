import * as actions from "@nteract/actions";
import { AppState, ContentRef, selectors } from "@nteract/core";
import { dirname } from "path";
import * as React from "react";
import { connect } from "react-redux";
import urljoin from "url-join";

import { ConnectedDirectory } from "./directory";
import { default as File } from "./file";
import { ConnectedFileHeader as FileHeader, DirectoryHeader } from "./headers";

interface IContentsProps {
  appBase: string;
  baseDir: string;
  contentType: "dummy" | "notebook" | "directory" | "file";
  contentRef: ContentRef;
  displayName: string;
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
      displayName: content.filepath.split("/").pop() || "",
      lastSavedStatement: "recently",
      mimetype: content.mimetype
    };
  };
  return mapStateToProps;
};

export default connect(makeMapStateToProps)(Contents);
