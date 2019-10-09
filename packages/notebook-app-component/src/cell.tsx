import React from "react";

import {
  CellType,
  ExecutionCount,
  ImmutableCodeCell,
  JSONObject
} from "@nteract/commutable";

import {
  KernelOutputError,
  Media,
  Output,
  PromptRequest,
  RichMedia,
  StreamText
} from "@nteract/outputs";

import {
  Cell as PlainCell,
  Input,
  Outputs,
  Pagers,
  Prompt,
  Source
} from "@nteract/presentational-components";

import { ContentRef, InputRequestMessage, AppState } from "@nteract/types";

import { selectors, actions } from "@nteract/core";

import Immutable from "immutable";
import { Subject } from "rxjs";

import Editor from "./editor";
import { HijackScroll } from "./hijack-scroll";
import MarkdownPreviewer from "./markdown-preview";

import Toolbar, { CellToolbarMask } from "./toolbar";
import TransformMedia from "./transform-media";

import styled from "styled-components";

import { connect } from "react-redux";
import { Dispatch } from "redux";

const emptyList = Immutable.List();
const emptySet = Immutable.Set();

const Cell = styled(PlainCell).attrs((props: { isSelected: boolean }) => ({
  className: props.isSelected ? "selected" : ""
}))`
  /*
     * Show the cell-toolbar-mask if hovering on cell,
     * cell was the last clicked
     */
  &:hover ${CellToolbarMask}, &.selected ${CellToolbarMask} {
    display: block;
  }
`;

Cell.displayName = "Cell";

interface AnyCellProps {
  id: string;
  tags: Immutable.Set<string>;
  contentRef: ContentRef;
  channels?: Subject<any>;
  cellType: "markdown" | "code" | "raw";
  theme: string;
  source: string;
  executionCount: ExecutionCount;
  outputs: Immutable.List<any>;
  pager: Immutable.List<any>;
  prompt?: InputRequestMessage;
  cellStatus: string;
  cellFocused: boolean; // not the ID of which is focused
  editorFocused: boolean;
  sourceHidden: boolean;
  executeCell: () => void;
  deleteCell: () => void;
  clearOutputs: () => void;
  toggleParameterCell: () => void;
  toggleCellInputVisibility: () => void;
  toggleCellOutputVisibility: () => void;
  toggleOutputExpansion: () => void;
  changeCellType: (to: CellType) => void;
  outputHidden: boolean;
  outputExpanded: boolean;
  selectCell: () => void;
  focusEditor: () => void;
  unfocusEditor: () => void;
  focusAboveCell: () => void;
  focusBelowCell: () => void;
  updateOutputMetadata: (
    index: number,
    metadata: JSONObject,
    mediaType: string
  ) => void;
  sendInputReply: (value: string) => void;
}

const makeMapStateToCellProps = (
  initialState: AppState,
  { id, contentRef }: { id: string; contentRef: ContentRef }
) => {
  const mapStateToCellProps = (state: AppState) => {
    const model = selectors.model(state, { contentRef });
    if (!model || model.type !== "notebook") {
      throw new Error(
        "Cell components should not be used with non-notebook models"
      );
    }

    const kernelRef = model.kernelRef;

    const cell = selectors.notebook.cellById(model, { id });
    if (!cell) {
      throw new Error("cell not found inside cell map");
    }

    const cellType = cell.cell_type;
    const outputs = cell.get("outputs", emptyList);
    const prompt = selectors.notebook.cellPromptById(model, { id });

    const sourceHidden =
      (cellType === "code" &&
        (cell.getIn(["metadata", "inputHidden"]) ||
          cell.getIn(["metadata", "hide_input"]))) ||
      false;

    const outputHidden =
      cellType === "code" &&
      (outputs.size === 0 || cell.getIn(["metadata", "outputHidden"]));

    const outputExpanded =
      cellType === "code" && cell.getIn(["metadata", "outputExpanded"]);

    const tags = cell.getIn(["metadata", "tags"]) || emptySet;

    const pager = model.getIn(["cellPagers", id]) || emptyList;

    let channels: Subject<any> | undefined;
    if (kernelRef) {
      const kernel = selectors.kernel(state, { kernelRef });
      if (kernel) {
        channels = kernel.channels;
      }
    }

    return {
      cellFocused: model.cellFocused === id,
      cellStatus: model.transient.getIn(["cellMap", id, "status"]),
      cellType,
      channels,
      contentRef,
      editorFocused: model.editorFocused === id,
      executionCount: (cell as ImmutableCodeCell).get("execution_count", null),
      outputExpanded,
      outputHidden,
      outputs,
      pager,
      prompt,
      source: cell.get("source", ""),
      sourceHidden,
      tags,
      theme: selectors.userTheme(state)
    };
  };
  return mapStateToCellProps;
};

const makeMapDispatchToCellProps = (
  initialDispatch: Dispatch,
  { id, contentRef }: { id: string; contentRef: ContentRef }
) => {
  const mapDispatchToCellProps = (dispatch: Dispatch) => ({
    focusAboveCell: () => {
      dispatch(actions.focusPreviousCell({ id, contentRef }));
      dispatch(actions.focusPreviousCellEditor({ id, contentRef }));
    },
    focusBelowCell: () => {
      dispatch(
        actions.focusNextCell({ id, createCellIfUndefined: true, contentRef })
      );
      dispatch(actions.focusNextCellEditor({ id, contentRef }));
    },
    focusEditor: () => dispatch(actions.focusCellEditor({ id, contentRef })),
    selectCell: () => dispatch(actions.focusCell({ id, contentRef })),
    unfocusEditor: () =>
      dispatch(actions.focusCellEditor({ id: undefined, contentRef })),

    changeCellType: (to: CellType) =>
      dispatch(
        actions.changeCellType({
          contentRef,
          id,
          to
        })
      ),
    clearOutputs: () => dispatch(actions.clearOutputs({ id, contentRef })),
    deleteCell: () => dispatch(actions.deleteCell({ id, contentRef })),
    executeCell: () => dispatch(actions.executeCell({ id, contentRef })),
    toggleCellInputVisibility: () =>
      dispatch(actions.toggleCellInputVisibility({ id, contentRef })),
    toggleCellOutputVisibility: () =>
      dispatch(actions.toggleCellOutputVisibility({ id, contentRef })),
    toggleOutputExpansion: () =>
      dispatch(actions.toggleOutputExpansion({ id, contentRef })),
    toggleParameterCell: () =>
      dispatch(actions.toggleParameterCell({ id, contentRef })),
    sendInputReply: (value: string) =>
      dispatch(actions.sendInputReply({ value, contentRef })),

    updateOutputMetadata: (
      index: number,
      metadata: JSONObject,
      mediaType: string
    ) => {
      dispatch(
        actions.updateOutputMetadata({
          id,
          contentRef,
          metadata,
          index,
          mediaType
        })
      );
    }
  });
  return mapDispatchToCellProps;
};

const CellBanner = styled.div`
  background-color: darkblue;
  color: ghostwhite;
  padding: 9px 16px;

  font-size: 12px;
  line-height: 20px;
`;

CellBanner.displayName = "CellBanner";

class AnyCell extends React.PureComponent<AnyCellProps> {
  toggleCellType = () => {
    this.props.changeCellType(
      this.props.cellType === "markdown" ? "code" : "markdown"
    );
  };

  render() {
    const {
      executeCell,
      deleteCell,
      clearOutputs,
      toggleParameterCell,
      toggleCellInputVisibility,
      toggleCellOutputVisibility,
      toggleOutputExpansion,
      changeCellType,
      cellFocused,
      cellStatus,
      cellType,
      editorFocused,
      focusAboveCell,
      focusBelowCell,
      focusEditor,
      id,
      prompt,
      tags,
      theme,
      selectCell,
      unfocusEditor,
      contentRef,
      sourceHidden,
      sendInputReply
    } = this.props;
    const running = cellStatus === "busy";
    const queued = cellStatus === "queued";
    let element = null;

    switch (cellType) {
      case "code":
        element = (
          <React.Fragment>
            <Input hidden={this.props.sourceHidden}>
              <Prompt
                counter={this.props.executionCount}
                running={running}
                queued={queued}
              />
              <Source>
                <Editor
                  id={id}
                  contentRef={contentRef}
                  focusAbove={focusAboveCell}
                  focusBelow={focusBelowCell}
                />
              </Source>
            </Input>
            <Pagers>
              {this.props.pager.map((pager, key) => (
                <RichMedia data={pager.data} metadata={pager.metadata}>
                  <Media.Json />
                  <Media.JavaScript />
                  <Media.HTML />
                  <Media.Markdown />
                  <Media.LaTeX />
                  <Media.SVG />
                  <Media.Image />
                  <Media.Plain />
                </RichMedia>
              ))}
            </Pagers>
            <Outputs
              hidden={this.props.outputHidden}
              expanded={this.props.outputExpanded}
            >
              {this.props.outputs.map((output, index) => (
                <Output output={output} key={index}>
                  <TransformMedia
                    output_type={"display_data"}
                    cellId={id}
                    contentRef={contentRef}
                    index={index}
                  />
                  <TransformMedia
                    output_type={"execute_result"}
                    cellId={id}
                    contentRef={contentRef}
                    index={index}
                  />
                  <KernelOutputError />
                  <StreamText />
                </Output>
              ))}
            </Outputs>
            {prompt && (
              <PromptRequest {...prompt} submitPromptReply={sendInputReply} />
            )}
          </React.Fragment>
        );

        break;
      case "markdown":
        element = (
          <MarkdownPreviewer
            focusAbove={focusAboveCell}
            focusBelow={focusBelowCell}
            focusEditor={focusEditor}
            cellFocused={cellFocused}
            editorFocused={editorFocused}
            unfocusEditor={unfocusEditor}
            source={this.props.source}
          >
            <Source>
              <Editor
                id={id}
                contentRef={contentRef}
                focusAbove={focusAboveCell}
                focusBelow={focusBelowCell}
              />
            </Source>
          </MarkdownPreviewer>
        );
        break;

      case "raw":
        element = (
          <Source>
            <Editor
              id={id}
              contentRef={contentRef}
              focusAbove={focusAboveCell}
              focusBelow={focusBelowCell}
            />
          </Source>
        );
        break;
      default:
        element = <pre>{this.props.source}</pre>;
        break;
    }

    return (
      <HijackScroll focused={cellFocused} onClick={selectCell}>
        <Cell isSelected={cellFocused}>
          {/* The following banners come from when papermill's acknowledged
                cell.metadata.tags are set
            */}
          {tags.has("parameters") ? (
            <CellBanner>Papermill - Parametrized</CellBanner>
          ) : null}
          {tags.has("default parameters") ? (
            <CellBanner>Papermill - Default Parameters</CellBanner>
          ) : null}
          <Toolbar
            type={cellType}
            cellFocused={cellFocused}
            executeCell={executeCell}
            deleteCell={deleteCell}
            clearOutputs={clearOutputs}
            toggleParameterCell={toggleParameterCell}
            toggleCellInputVisibility={toggleCellInputVisibility}
            toggleCellOutputVisibility={toggleCellOutputVisibility}
            toggleOutputExpansion={toggleOutputExpansion}
            changeCellType={this.toggleCellType}
            sourceHidden={sourceHidden}
          />
          {element}
        </Cell>
      </HijackScroll>
    );
  }
}

const ConnectedCell = connect(
  makeMapStateToCellProps,
  makeMapDispatchToCellProps
)(AnyCell);

export default ConnectedCell;
