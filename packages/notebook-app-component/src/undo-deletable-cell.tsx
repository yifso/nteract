import * as actions from "@nteract/actions";
import * as selectors from "@nteract/selectors";
import { AppState, ContentRef } from "@nteract/types";
import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import styled from "styled-components";

interface InitialProps {
  id: string;
  contentRef: ContentRef;
  children: React.ReactNode;
}

interface UndoDeletableCellProps extends InitialProps {
  isDeleting: boolean;
  deleteCell: () => void;
  unmarkCellAsDeleting: () => void;
}

const makeMapStateToProps = (
  initialState: AppState,
  initialProps: InitialProps
) => {
  const { id, contentRef } = initialProps;

  return (state: AppState) => {
    const model = selectors.model(state, { contentRef });
    if (!model || model.type !== "notebook") {
      throw new Error("non-notebook model");
    }
    const cell = selectors.notebook.cellById(model, { id });
    if (!cell) {
      throw new Error("cell not found inside cell map");
    }
    const isDeleting = !!cell.getIn(["transient", "deleting"]);

    return {
      isDeleting,
    };
  };
};

const makeMapDispatchToProps = (
  initialDispatch: Dispatch,
  initialProps: InitialProps
) => {
  const { id, contentRef } = initialProps;
  return (dispatch: Dispatch) => ({
    deleteCell: () =>
      dispatch(actions.deleteCell({ id, contentRef })),
    unmarkCellAsDeleting: () =>
      dispatch(actions.unmarkCellAsDeleting({ id, contentRef })),
  });
};

const UndoCellDeletion = styled.div`
  background-color: var(--theme-cell-input-bg);
  color: var(--theme-cell-input-fg);
  padding: 1rem;
  padding-right: 10rem;
`;

UndoCellDeletion.displayName = "UndoCellDeletion";

const UndoButton = styled.button`
  // The cell-creator overlaps the button; position it above
  position: absolute;
  right: 1.25rem;
  z-index: 1;
`;

UndoButton.displayName = "UndoButton";

class TimerUndoCellDeletion
  extends React.PureComponent<UndoDeletableCellProps> {

  timer: NodeJS.Timeout | null = null;

  componentDidMount(): void {
    this.timer = setTimeout(this.props.deleteCell, 10000);
  }

  componentWillUnmount(): void {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  render(): JSX.Element {
    return (
      <UndoCellDeletion>
        This cell was deleted.
        <UndoButton onClick={this.props.unmarkCellAsDeleting}>Undo</UndoButton>
      </UndoCellDeletion>
    );
  }
}

const RawUndoDeletableCell = (props: UndoDeletableCellProps) =>
  props.isDeleting
    ? <TimerUndoCellDeletion {...props}/>
    : <React.Fragment>{props.children}</React.Fragment>;

export const UndoDeletableCell = connect(
  makeMapStateToProps,
  makeMapDispatchToProps,
)(RawUndoDeletableCell);
UndoDeletableCell.displayName = "UndoDeletableCell";
