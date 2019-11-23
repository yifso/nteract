import React from "react";
import Immutable from "immutable";
import { connect } from "react-redux";
import { Dispatch } from "redux";

import { ContentRef, actions } from "@nteract/core";
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

const RawCell = connect(null, mapDispatchToProps)(PureRawCell);

PureRawCell.defaultProps = {
  cell_type: "raw"
};

export default RawCell;
