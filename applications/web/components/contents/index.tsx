// Vendor modules
import * as actions from "@nteract/actions";
import { CellType, ImmutableNotebook } from "@nteract/commutable";
import { HeaderEditor } from "@nteract/connected-components";
import { NotebookMenu } from "@nteract/connected-components";
import { HeaderDataProps } from "@nteract/connected-components/lib/header-editor";
import { AppState, ContentRef, HostRecord, selectors } from "@nteract/core";
import {
  DirectoryContentRecordProps,
  DummyContentRecordProps,
  FileContentRecordProps,
  NotebookContentRecordProps
} from "@nteract/types";
import { RecordOf } from "immutable";
import { dirname } from "path";
import * as React from "react";
import { HotKeys, KeyMap } from "react-hotkeys";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import urljoin from "url-join";

// Local modules
import { default as File } from "./file";
import { ConnectedFileHeader as FileHeader, DirectoryHeader } from "./headers";

interface IContentsBaseProps {
  appBase: string;
  baseDir: string;
  contentType: "dummy" | "notebook" | "directory" | "file";
  contentRef: ContentRef;
  displayName: string;
  error?: object | null;
  filepath: string | undefined;
  lastSavedStatement: string;
  loading: boolean;
  mimetype?: string | null;
  saving: boolean;
}

interface IContentsState {
  isDialogOpen: boolean;
}

interface IStateToProps {
  headerData?: HeaderDataProps;
  showHeaderEditor: boolean;
}

interface IDispatchFromProps {
  handlers: any;
  onHeaderEditorChange: (props: HeaderDataProps) => void;
}

type ContentsProps = IContentsBaseProps & IStateToProps & IDispatchFromProps;

class Contents extends React.PureComponent<ContentsProps, IContentsState> {
  private keyMap: KeyMap = {
    CHANGE_CELL_TYPE: [
      "ctrl+shift+y",
      "ctrl+shift+m",
      "meta+shift+y",
      "meta+shift+m"
    ],
    COPY_CELL: ["ctrl+shift+c", "meta+shift+c"],
    CREATE_CELL_ABOVE: ["ctrl+shift+a", "meta+shift+a"],
    CREATE_CELL_BELOW: ["ctrl+shift+b", "meta+shift+b"],
    CUT_CELL: ["ctrl+shift+x", "meta+shift+x"],
    DELETE_CELL: ["ctrl+shift+d", "meta+shift+d"],
    EXECUTE_ALL_CELLS: ["alt+r a"],
    INTERRUPT_KERNEL: ["alt+r i"],
    KILL_KERNEL: ["alt+r k"],
    OPEN: ["ctrl+o", "meta+o"],
    PASTE_CELL: ["ctrl+shift+v"],
    RESTART_KERNEL: ["alt+r r", "alt+r c", "alt+r a"],
    SAVE: ["ctrl+s", "ctrl+shift+s", "meta+s", "meta+shift+s"]
  };

  render(): JSX.Element {
    const {
      appBase,
      baseDir,
      contentRef,
      contentType,
      displayName,
      error,
      handlers,
      loading,
      saving
    } = this.props;

    switch (contentType) {
      case "notebook":
      case "file":
      case "dummy":
        return (
          <React.Fragment>
            <HotKeys keyMap={this.keyMap} handlers={handlers}>
              <FileHeader
                appBase={appBase}
                baseDir={baseDir}
                contentRef={contentRef}
                displayName={displayName}
                error={error}
                loading={loading}
                saving={saving}
              >
                {contentType === "notebook" ? (
                  <NotebookMenu contentRef={contentRef} />
                ) : null}
              </FileHeader>
              <File contentRef={contentRef} appBase={appBase} />
            </HotKeys>
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

const makeMapStateToProps: any = (
  initialState: AppState,
  initialProps: { appBase: string; contentRef: ContentRef }
) => {
  const mapStateToProps = (state: AppState): Partial<ContentsProps> => {
    const contentRef: ContentRef = initialProps.contentRef;

    const content:
      | RecordOf<NotebookContentRecordProps>
      | RecordOf<DummyContentRecordProps>
      | RecordOf<FileContentRecordProps>
      | RecordOf<DirectoryContentRecordProps>
      | undefined = selectors.content(state, { contentRef });

    return {
      baseDir: content && dirname(content.filepath),
      contentRef,
      contentType: content && content.type,
      displayName: (content && content.filepath.split("/").pop()) || "",
      error: content && content.error,
      filepath: content && content.filepath,
      loading: content && content.loading,
      mimetype: content && content.mimetype,
      saving: content && content.saving
    };
  };

  return mapStateToProps;
};

const mapDispatchToProps = (
  dispatch: Dispatch,
  ownProps: ContentsProps
): object => {
  const { appBase, contentRef } = ownProps;

  return {
    onHeaderEditorChange: (props: HeaderDataProps) => {
      return dispatch(
        actions.overwriteMetadataFields({
          ...props,
          contentRef: ownProps.contentRef
        })
      );
    },
    // `HotKeys` handlers object
    // see: https://github.com/greena13/react-hotkeys#defining-handlers
    handlers: {
      CHANGE_CELL_TYPE: (event: KeyboardEvent) => {
        const type: CellType = event.key === "Y" ? "code" : "markdown";
        return dispatch(actions.changeCellType({ to: type, contentRef }));
      },
      COPY_CELL: () => dispatch(actions.copyCell({ contentRef })),
      CREATE_CELL_ABOVE: () =>
        dispatch(actions.createCellAbove({ cellType: "code", contentRef })),
      CREATE_CELL_BELOW: () =>
        dispatch(
          actions.createCellBelow({ cellType: "code", source: "", contentRef })
        ),
      CUT_CELL: () => dispatch(actions.cutCell({ contentRef })),
      DELETE_CELL: () => dispatch(actions.deleteCell({ contentRef })),
      EXECUTE_ALL_CELLS: () =>
        dispatch(actions.executeAllCells({ contentRef })),
      INTERRUPT_KERNEL: () => dispatch(actions.interruptKernel({})),
      KILL_KERNEL: () => dispatch(actions.killKernel({ restarting: false })),
      OPEN: () => {
        // On initialization, the appBase prop is not available.
        const nteractEditUri = "/nteract/edit";
        const url = appBase ? urljoin(appBase, nteractEditUri) : nteractEditUri;
        window.open(url, "_blank");
      },
      PASTE_CELL: () => dispatch(actions.pasteCell({ contentRef })),
      RESTART_KERNEL: (event: KeyboardEvent) => {
        const outputHandling: "None" | "Clear All" | "Run All" =
          event.key === "r"
            ? "None"
            : event.key === "a"
            ? "Run All"
            : "Clear All";
        return dispatch(actions.restartKernel({ outputHandling, contentRef }));
      },
      SAVE: () => dispatch(actions.save({ contentRef }))
    }
  };
};

export default connect(makeMapStateToProps, mapDispatchToProps)(Contents);
