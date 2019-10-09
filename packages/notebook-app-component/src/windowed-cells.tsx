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

const useWindowResize = () => {
  let [size, setSize] = React.useState([0, 0]);
  React.useLayoutEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);
  return size;
};

interface CellsContextItems {
  setSize?: any;
  windowWidth?: number;
}

export const CellsContext = React.createContext<CellsContextItems>({});

interface CellContainerProps {
  children: any;
  style: any;
  index: number;
}

const CellContainer = (props: CellContainerProps) => {
  const { children, style, index } = props;
  const { setSize, windowWidth } = React.useContext(CellsContext);
  const root = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    setSize(
      index,
      root && root.current ? root.current.getBoundingClientRect().height : 0
    );
  }, [windowWidth]);
  return (
    <div
      className="cell-container"
      key={`cell-container-${index}`}
      style={style}
      ref={root}
    >
      {children}
    </div>
  );
};

const PureWindowedCells = (props: WindowedCellsProps) => {
  const sizeMap = React.useRef<{ [index: number]: number }>({});
  const setSize = React.useCallback((index, size) => {
    sizeMap.current = { ...sizeMap.current, [index]: size };
  }, []);
  const getSize = React.useCallback(index => sizeMap.current[index] || 100, []);
  const [windowWidth] = useWindowResize();

  return (
    <CellsContext.Provider value={{ setSize, windowWidth }}>
      <Cells>
        <CellCreator
          id={props.cellOrder.get(0)}
          above
          contentRef={props.contentRef}
        />
        <AutoSizer>
          {({ height, width }: { height: number; width: number }) => {
            return (
              <List
                height={height}
                itemCount={props.cellOrder.size}
                itemSize={getSize}
                width={width}
              >
                {({ index, style }) => {
                  const cellId = props.cellOrder.get(index);
                  return (
                    <CellContainer index={index} style={style}>
                      <DraggableCell
                        moveCell={props.moveCell}
                        id={cellId}
                        focusCell={props.focusCell}
                        contentRef={props.contentRef}
                      >
                        <ConnectedCell
                          id={cellId}
                          contentRef={props.contentRef}
                        />
                      </DraggableCell>
                      <CellCreator
                        key={`creator-${cellId}`}
                        id={cellId}
                        above={false}
                        contentRef={props.contentRef}
                      />
                    </CellContainer>
                  );
                }}
              </List>
            );
          }}
        </AutoSizer>
      </Cells>
    </CellsContext.Provider>
  );
};

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
