import React from "react";
import Immutable from "immutable";
import { connect } from "react-redux";
import { Dispatch } from "redux";

import { ContentRef, actions, AppState } from "@nteract/core";
import { Source } from "@nteract/presentational-components";

import Editor from "../inputs/editor";

interface ComponentProps {
  id: string;
  contentRef: ContentRef;
  cell: Immutable.Map<string, any>;
  cell_type: "raw";
}

interface DispatchProps {
  focusAboveCell: () => void;
  focusBelowCell: () => void;
}

export class PureRawCell extends React.Component<
  ComponentProps & DispatchProps
> {
  render() {
    const { id, contentRef, focusAboveCell, focusBelowCell } = this.props;

    return (
      <Source>
        <Editor
          id={id}
          contentRef={contentRef}
          focusAbove={focusAboveCell}
          focusBelow={focusBelowCell}
        />
      </Source>
    );
  }
}

const mapDispatchToProps = (
  dispatch: Dispatch,
  ownProps: ComponentProps
): DispatchProps => {
  const { id, contentRef } = ownProps;
  return {
    focusAboveCell: () => {
      dispatch(actions.focusPreviousCell({ id, contentRef }));
      dispatch(actions.focusPreviousCellEditor({ id, contentRef }));
    },
    focusBelowCell: () => {
      dispatch(
        actions.focusNextCell({ id, createCellIfUndefined: true, contentRef })
      );
      dispatch(actions.focusNextCellEditor({ id, contentRef }));
    }
  };
};

PureRawCell.defaultProps = {
  cell_type: "raw"
};

const RawCell = connect<void, DispatchProps, ComponentProps, AppState>(
  null,
  mapDispatchToProps
)(PureRawCell);

export default RawCell;
