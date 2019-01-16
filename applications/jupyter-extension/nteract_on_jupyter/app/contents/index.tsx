import * as actions from "@nteract/actions";
import { AppState, ContentRef, selectors } from "@nteract/core";
import { dirname } from "path";
import * as React from "react";
import Hotkeys from "react-hot-keys";
import { connect } from "react-redux";
import { Dispatch } from "redux";
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
  save: (payload: actions.Save["payload"]) => void;
}

interface IContentsState {
  isDialogOpen: boolean;
}

interface IHotkeysKeyDownHandle {
  key: string;
  method: () => void;
  mods: number[];
  scope: string;
  shortcut: string;
}

class Contents extends React.PureComponent<IContentsProps, IContentsState> {
  // Keybinding combinations
  hotkeys: string = `
    ctrl+space,
    ctrl+.,
    ctrl+o,
    ctrl+s,
    ctrl+shift+s,
    ctrl+shift+z,
    ctrl+z,
    ctrl+shift+c,
    ctrl+shift+x,
    ctrl+shift+d,
    ctrl+shift+v,
    ctrl+shift+y,
    ctrl+shift+m,
    shift+enter,
    ctrl+enter,
    ctrl+shift+a,
    ctrl+shift+b
  `;

  // Maps action types to actions
  hotkeysMap = new Map([
    ["ctrl+s", this.props.save] // Save
  ]);

  // Captures all keydown events on the App
  onKeyDown = (
    keyName: string,
    e: KeyboardEvent,
    handle: IHotkeysKeyDownHandle
  ): void => {
    if (this.hotkeysMap.get(keyName)) {
      this.hotkeysMap.get(keyName)({ contentRef: this.props.contentRef });
    }
  };

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
            <Hotkeys keyName={this.hotkeys} onKeyDown={this.onKeyDown}>
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
            </Hotkeys>
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

const mapDispatchToProps = (dispatch: Dispatch) => ({
  save: (payload: actions.Save["payload"]) => dispatch(actions.save(payload))
});

export default connect(
  makeMapStateToProps,
  mapDispatchToProps
)(Contents);
