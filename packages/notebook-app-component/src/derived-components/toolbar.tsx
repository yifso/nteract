/* eslint jsx-a11y/no-static-element-interactions: 0 */
/* eslint jsx-a11y/click-events-have-key-events: 0 */
/* eslint jsx-a11y/anchor-is-valid: 0 */

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

import { CellToolbar, CellToolbarContext } from "@nteract/stateful-components";

export interface ComponentProps {
  contentRef: ContentRef;
  id: string;
}

interface ComponentState {
  moreActionsMenuExpanded: boolean;
}

export default class Toolbar extends React.PureComponent<
  ComponentProps,
  ComponentState
> {
  static contextType = CellToolbarContext;

  constructor(props: ComponentProps) {
    super(props);
    this.state = { moreActionsMenuExpanded: false };
  }

  render(): JSX.Element {
    return (
      <CellToolbar contentRef={this.props.contentRef} id={this.props.id}>
        <CellToolbarContext.Consumer>
          {(context: any) => (
            <React.Fragment>
              {context.type !== "markdown" ? (
                <button
                  onClick={context.executeCell}
                  title="execute cell"
                  className="executeButton"
                >
                  <span className="octicon">
                    <TriangleRightOcticon />
                  </span>
                </button>
              ) : null}
              <DropdownMenu
                onDisplayChanged={(expanded: boolean) => {
                  this.setState({ moreActionsMenuExpanded: expanded });
                }}
              >
                <DropdownTrigger>
                  <button
                    title="show additional actions"
                    aria-expanded={this.state.moreActionsMenuExpanded}
                  >
                    <span className="octicon toggle-menu">
                      <ChevronDownOcticon />
                    </span>
                  </button>
                </DropdownTrigger>
                {context.type === "code" ? (
                  <DropdownContent>
                    <div className="nteract-cell-toolbar-role">
                    <button 
                      onClick={context.clearOutputs}
                      className="clearOutput"
                      role="option"
                      //aria-selected="false"
                      //tabIndex={0}
                    >
                      <a>Clear Cell Output</a>
                    </button>
                    <button
                      onClick={context.toggleCellInputVisibility}
                      className="inputVisibility"
                      role="option"
                      aria-selected="false"
                      tabIndex={0}
                    >
                      <a>Toggle Input Visibility</a>
                    </button>
                    <button
                      onClick={context.toggleCellOutputVisibility}
                      className="outputVisibility"
                      role="option"
                      aria-selected="false"
                      tabIndex={0}
                    >
                      <a>Toggle Output Visibility</a>
                    </button>
                    <button
                      onClick={context.toggleOutputExpansion}
                      className="outputExpanded"
                      role="option"
                      aria-selected="false"
                      tabIndex={0}
                    >
                      <a>Toggle Expanded Output</a>
                    </button>
                    <button
                      onClick={context.toggleParameterCell}
                      role="option"
                      aria-selected="false"
                      tabIndex={0}
                    >
                      <a>Toggle Parameter Cell</a>
                    </button>

                    <button
                      onClick={context.changeToMarkdownCell}
                      className="changeType"
                      role="option"
                      aria-selected="false"
                      tabIndex={0}
                    >
                      <a>Convert to Markdown Cell</a>
                    </button>
                    </div>
                  </DropdownContent>
                ) : (
                  <DropdownContent>
                    <div className="nteract-cell-toolbar-role">
                    <button
                      onClick={context.changeToCodeCell}
                      className="changeType"
                      role="option"
                      aria-selected="false"
                      tabIndex={0}
                    >
                      <a>Convert to Code Cell</a>
                    </button>
                    </div>
                  </DropdownContent>
                )}
              </DropdownMenu>
              <span className="spacer" />
              <button
                onClick={context.markCellAsDeleting}
                title="delete cell"
                className="deleteButton"
              >
                <span className="octicon">
                  <TrashOcticon />
                </span>
              </button>
            </React.Fragment>
          )}
        </CellToolbarContext.Consumer>
      </CellToolbar>
    );
  }
}
