import React from "react";
import AutoSizer from "react-virtualized-auto-sizer";
import { VariableSizeList as List } from "react-window";
import { connect } from "react-redux";
import { Dispatch } from "redux";

import CellCreator from "./cell-creator";
import DraggableCell from "./draggable-cell";
import ConnectedCell from "./cell";

import { CellId } from "@nteract/commutable";
import { ContentRef, AppState } from "@nteract/types";
import { actions, selectors } from "@nteract/core";

import Immutable from "immutable";

import styled from "styled-components";

interface WindowedCellsStateProps {
  cellOrder: Immutable.List<any>;
  contentRef: ContentRef;
}

interface WindowedCellsDispatchProps {
  focusCell: (payload: { id: CellId; contentRef: ContentRef }) => void;
  moveCell: (payload: {
    id: CellId;
    destinationId: CellId;
    above: boolean;
    contentRef: ContentRef;
  }) => void;
}

type WindowedCellsProps = WindowedCellsDispatchProps & WindowedCellsStateProps;

const Cells = styled.div`
  height: 2000px;
`;

export class PureWindowedCells extends React.Component<WindowedCellsProps> {
  render() {
    console.log(this.props.contentRef);
    return (
      <Cells>
        <CellCreator
          id={this.props.cellOrder.get(0)}
          above
          contentRef={this.props.contentRef}
        />
        <AutoSizer>
          {({ height, width }: { height: number; width: number }) => {
            console.log(height);
            console.log(width);
            return (
              <List
                height={height}
                itemCount={1000}
                itemSize={(index: number) => 100}
                width={width}
              >
                {({ index, style }) => {
                  const cellId = this.props.cellOrder.get(index);
                  console.log(index);
                  console.log(style);
                  return (
                    <div
                      className="cell-container"
                      key={`cell-container-${cellId}`}
                      style={style}
                    >
                      <DraggableCell
                        moveCell={this.props.moveCell}
                        id={cellId}
                        focusCell={this.props.focusCell}
                        contentRef={this.props.contentRef}
                      >
                        <ConnectedCell
                          id={cellId}
                          contentRef={this.props.contentRef}
                        />
                      </DraggableCell>
                      <CellCreator
                        key={`creator-${cellId}`}
                        id={cellId}
                        above={false}
                        contentRef={this.props.contentRef}
                      />
                    </div>
                  );
                }}
              </List>
            );
          }}
        </AutoSizer>
      </Cells>
    );
  }
}

const makeMapStateToProps = (
  initialState: AppState,
  initialProps: { contentRef: ContentRef }
) => {
  const { contentRef } = initialProps;
  if (!contentRef) {
    throw new Error("<Notebook /> has to have a contentRef");
  }

  const mapStateToProps = (state: AppState): WindowedCellsStateProps => {
    const content = selectors.content(state, { contentRef });
    const model = selectors.model(state, { contentRef });

    if (!model || !content) {
      throw new Error(
        "<Notebook /> has to have content & model that are notebook types"
      );
    }

    if (model.type !== "notebook") {
      return {
        cellOrder: Immutable.List(),
        contentRef
      };
    }

    if (model.type !== "notebook") {
      throw new Error(
        "<Notebook /> has to have content & model that are notebook types"
      );
    }

    return {
      cellOrder: model.notebook.cellOrder,
      contentRef
    };
  };
  return mapStateToProps;
};

const mapDispatchToProps = (
  dispatch: Dispatch
): WindowedCellsDispatchProps => ({
  focusCell: (payload: { id: CellId; contentRef: ContentRef }) =>
    dispatch(actions.focusCell(payload)),
  moveCell: (payload: {
    id: CellId;
    destinationId: CellId;
    above: boolean;
    contentRef: ContentRef;
  }) => dispatch(actions.moveCell(payload))
});

export default connect(
  makeMapStateToProps,
  mapDispatchToProps
)(PureWindowedCells);
