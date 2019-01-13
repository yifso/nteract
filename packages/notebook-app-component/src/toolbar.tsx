/* eslint jsx-a11y/no-static-element-interactions: 0 */
/* eslint jsx-a11y/click-events-have-key-events: 0 */
/* eslint jsx-a11y/anchor-is-valid: 0 */

// TODO: Fix up a11y eslint here
// TODO: All the `<li>` below that have role button should just be `<button>` with proper styling

import * as actions from "@nteract/actions";
import {
  DropdownContent,
  DropdownMenu,
  DropdownTrigger
} from "@nteract/dropdown-menu";
import {
  ChevronDownOcticon,
  TrashOcticon,
  TriangleRightOcticon
} from "@nteract/octicons";
import { ContentRef } from "@nteract/types";
import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";

import styled from "styled-components";

export interface PureToolbarProps {
  type: "markdown" | "code" | "raw";
  executeCell?: () => void;
  deleteCell?: () => void;
  clearOutputs?: () => void;
  toggleParameterCell?: () => void;
  toggleCellInputVisibility?: () => void;
  toggleCellOutputVisibility?: () => void;
  toggleOutputExpansion?: () => void;
  changeCellType?: () => void;
  sourceHidden: boolean;
  contentRef: ContentRef;
}

export const CellToolbar = styled.div`
  background-color: var(--theme-cell-toolbar-bg);
  opacity: 0.4;
  transition: opacity 0.4s;

  & > div {
    display: inline-block;
  }

  :hover {
    opacity: 1;
  }

  button {
    display: inline-block;

    width: 22px;
    height: 20px;
    padding: 0px 4px;

    text-align: center;

    border: none;
    outline: none;
    background: none;
  }

  span {
    font-size: 15px;
    line-height: 1;
    color: var(--theme-cell-toolbar-fg);
  }

  button span:hover {
    color: var(--theme-cell-toolbar-fg-hover);
  }

  .octicon {
    transition: color 0.5s;
  }

  span.spacer {
    display: inline-block;
    vertical-align: middle;
    margin: 1px 5px 3px 5px;
    height: 11px;
  }
`;

export const CellToolbarMask = styled.div`
  z-index: 9999;
  display: ${(props: { sourceHidden?: boolean }) =>
    props.sourceHidden ? "block" : "none"};
  position: absolute;
  top: 0px;
  right: 0px;
  height: 34px;

  /* Set the left padding to 50px to give users extra room to move their
              mouse to the toolbar without causing the cell to go out of focus and thus
              hide the toolbar before they get there. */
  padding: 0px 0px 0px 50px;
`;

export class PureToolbar extends React.Component<PureToolbarProps> {
  static defaultProps: Partial<PureToolbarProps> = {
    type: "code"
  };

  render() {
    const { type, executeCell, deleteCell, sourceHidden } = this.props;

    return (
      <CellToolbarMask sourceHidden={sourceHidden}>
        <CellToolbar>
          {type !== "markdown" && (
            <button
              onClick={executeCell}
              title="execute cell"
              className="executeButton"
            >
              <span className="octicon">
                <TriangleRightOcticon />
              </span>
            </button>
          )}
          <DropdownMenu>
            <DropdownTrigger>
              <button title="show additional actions">
                <span className="octicon toggle-menu">
                  <ChevronDownOcticon />
                </span>
              </button>
            </DropdownTrigger>
            {type === "code" ? (
              <DropdownContent>
                <li
                  onClick={this.props.clearOutputs}
                  className="clearOutput"
                  role="option"
                  aria-selected="false"
                  tabIndex={0}
                >
                  <a>Clear Cell Output</a>
                </li>
                <li
                  onClick={this.props.toggleCellInputVisibility}
                  className="inputVisibility"
                  role="option"
                  aria-selected="false"
                  tabIndex={0}
                >
                  <a>Toggle Input Visibility</a>
                </li>
                <li
                  onClick={this.props.toggleCellOutputVisibility}
                  className="outputVisibility"
                  role="option"
                  aria-selected="false"
                  tabIndex={0}
                >
                  <a>Toggle Output Visibility</a>
                </li>
                <li
                  onClick={this.props.toggleOutputExpansion}
                  className="outputExpanded"
                  role="option"
                  aria-selected="false"
                  tabIndex={0}
                >
                  <a>Toggle Expanded Output</a>
                </li>
                <li
                  onClick={this.props.toggleParameterCell}
                  role="option"
                  aria-selected="false"
                  tabIndex={0}
                >
                  <a>Toggle Parameter Cell</a>
                </li>

                <li
                  onClick={this.props.changeCellType}
                  className="changeType"
                  role="option"
                  aria-selected="false"
                  tabIndex={0}
                >
                  <a>Convert to Markdown Cell</a>
                </li>
              </DropdownContent>
            ) : (
              <DropdownContent>
                <li
                  onClick={this.props.changeCellType}
                  className="changeType"
                  role="option"
                  aria-selected="false"
                  tabIndex={0}
                >
                  <a>Convert to Code Cell</a>
                </li>
              </DropdownContent>
            )}
          </DropdownMenu>
          <span className="spacer" />
          <button
            onClick={deleteCell}
            title="delete cell"
            className="deleteButton"
          >
            <span className="octicon">
              <TrashOcticon />
            </span>
          </button>
        </CellToolbar>
      </CellToolbarMask>
    );
  }
}

// eslint-disable-next-line no-unused-vars
interface ConnectedProps {
  id: string;
  type: "markdown" | "code" | "raw";
  executeCell: () => void;
  deleteCell: () => void;
  clearOutputs: () => void;
  toggleCellOutputVisibility: () => void;
  toggleCellInputVisibility: () => void;
  changeCellType: () => void;
  toggleOutputExpansion: () => void;
}

interface InitialProps {
  id: string;
  type: "markdown" | "code" | "raw";
  contentRef: ContentRef;
}

const makeMapDispatchToProps = (
  initialDispatch: Dispatch,
  initialProps: InitialProps
) => {
  const { contentRef, id, type } = initialProps;
  const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
      toggleParameterCell: () =>
        dispatch(actions.toggleParameterCell({ id, contentRef })),
      deleteCell: () => dispatch(actions.deleteCell({ id, contentRef })),
      executeCell: () => dispatch(actions.executeCell({ id, contentRef })),
      clearOutputs: () => dispatch(actions.clearOutputs({ id, contentRef })),
      toggleCellOutputVisibility: () =>
        dispatch(actions.toggleCellOutputVisibility({ id, contentRef })),
      toggleCellInputVisibility: () =>
        dispatch(actions.toggleCellInputVisibility({ id, contentRef })),
      changeCellType: () =>
        dispatch(
          actions.changeCellType({
            id,
            to: type === "markdown" ? "code" : "markdown",
            contentRef
          })
        ),
      toggleOutputExpansion: () =>
        dispatch(actions.toggleOutputExpansion({ id, contentRef }))
    };
  };
  return mapDispatchToProps;
};

// TODO: This toolbar could easily make use of ownProps (contentRef, cellId)
//       and pluck exactly the state it wants
export default connect(
  null,
  makeMapDispatchToProps
)(PureToolbar);
