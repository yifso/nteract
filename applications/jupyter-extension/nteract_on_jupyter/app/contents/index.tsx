import * as actions from "@nteract/actions";
import { AppState, ContentRef, HostRecord, selectors } from "@nteract/core";
import { dirname } from "path";
import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import urljoin from "url-join";

import { HotKeys, IHotKeysHandle } from "../components/hot-keys";
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
  save: (payload: actions.Save["payload"]) => void;
}

interface IContentsState {
  isDialogOpen: boolean;
}

class Contents extends React.PureComponent<IContentsProps, IContentsState> {
  // Maps action types to actions
  private hotkeysMap: Map<string, any> = new Map([
    ["ctrl+s", this.props.save] // Save
  ]);

  render(): JSX.Element {
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

    // Keybinding combinations
    const hotkeys: string = this.getHotkeys(this.hotkeysMap);

    switch (contentType) {
      case "notebook":
      case "file":
      case "dummy":
        return (
          <React.Fragment>
            <HotKeys keyName={hotkeys} onKeyDown={this.onKeyDown}>
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
            </HotKeys>
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

  // Captures all keydown events on the App
  private onKeyDown = (
    keyName: string,
    e: KeyboardEvent,
    handle: IHotKeysHandle
  ): void => {
    if (this.hotkeysMap.get(keyName)) {
      this.hotkeysMap.get(keyName)({ contentRef: this.props.contentRef });
    }
  };

  private getHotkeys = (map: Map<string, any>) => {
    return Array.from(map)
      .map(arr => arr[0])
      .join(",");
  };
}

const makeMapStateToProps: any = (
  initialState: AppState,
  initialProps: { contentRef: ContentRef }
) => {
  const host: HostRecord = initialState.app.host;

  if (host.type !== "jupyter") {
    throw new Error("this component only works with jupyter apps");
  }

  const appBase: string = urljoin(host.basePath, "/nteract/edit");

  const mapStateToProps: any = (state: AppState) => {
    const contentRef: ContentRef = initialProps.contentRef;

    if (!contentRef) {
      throw new Error("cant display without a contentRef");
    }

    const content: any = selectors.content(state, { contentRef });

    if (!content) {
      throw new Error("need content to view content, check your contentRefs");
    }

    return {
      appBase,
      baseDir: dirname(content.filepath),
      contentRef,
      contentType: content.type,
      displayName: content.filepath.split("/").pop() || "",
      error: content.error,
      lastSavedStatement: "recently",
      loading: content.loading,
      mimetype: content.mimetype,
      saving: content.saving
    };
  };
  return mapStateToProps;
};

const mapDispatchToProps: any = (dispatch: Dispatch) => ({
  save: (payload: actions.Save["payload"]) => dispatch(actions.save(payload))
});

export default connect(
  makeMapStateToProps,
  mapDispatchToProps
)(Contents);
