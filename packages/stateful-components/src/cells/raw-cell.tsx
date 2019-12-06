import React from "react";
import Immutable from "immutable";
import { connect } from "react-redux";
import { Dispatch } from "redux";

import { ContentRef, actions, AppState } from "@nteract/core";
import { Source } from "@nteract/presentational-components";

import Editor from "../inputs/editor";

import childWithDisplayName from "../pickers/display-name";

interface ComponentProps {
  id: string;
  contentRef: ContentRef;
  cell: Immutable.Map<string, any>;
  cell_type: "raw";
  children?: React.ReactNode;
}

interface DispatchProps {
  focusAboveCell: () => void;
  focusBelowCell: () => void;
}

export class PureRawCell extends React.Component<
  ComponentProps & DispatchProps
> {
  render() {
    const { id, contentRef, children } = this.props;

    const EditorOverride = childWithDisplayName(children, "Editor");

    return (
      <Source>
        <Editor id={id} contentRef={contentRef}>
          {EditorOverride ? (
            <EditorOverride id={id} contentRef={contentRef} />
          ) : (
            <CodeMirrorEditor />
          )}
        </Editor>
      </Source>
    );
  }
}

export const makeMapDispatchToProps = (
  dispatch: Dispatch,
  ownProps: ComponentProps
): ((dispatch: Dispatch) => DispatchProps) => {
  const mapDispatchToProps = (dispatch: Dispatch) => {
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
  return mapDispatchToProps;
};

const RawCell = connect<void, DispatchProps, ComponentProps, AppState>(
  null,
  makeMapDispatchToProps
)(PureRawCell);

RawCell.defaultProps = {
  cell_type: "raw"
};

export default RawCell;
