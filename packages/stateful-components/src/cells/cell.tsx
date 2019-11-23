import Immutable from "immutable";
import React from "react";
import { connect } from "react-redux";

import { selectors, AppState } from "@nteract/core";

interface ComponentProps {
  id: string;
  contentRef: string;
}

interface StateProps {
  cell: Immutable.Map<string, any>;
}

export class Cell extends React.Component<ComponentProps & StateProps> {
  render() {
    // We must pick only one child to render
    let chosenOne: React.ReactChild | null = null;

    if (!this.props.cell) {
      return null;
    }

    const cell_type = this.props.cell.cell_type;

    // Find the first child element that matches something in this.props.data
    React.Children.forEach(this.props.children, child => {
      if (typeof child === "string" || typeof child === "number") {
        return;
      }

      const childElement = child;
      if (chosenOne) {
        // Already have a selection
        return;
      }
      if (childElement.props && childElement.props.cell_type) {
        const child_cell_type: string[] = Array.isArray(
          childElement.props.cell_type
        )
          ? childElement.props.cell_type
          : [childElement.props.cell_type];

        chosenOne = child_cell_type.includes(cell_type) ? childElement : null;
        return;
      }
    });

    // If we didn't find a match, render nothing
    if (chosenOne === null) {
      return null;
    }

    // Render the output component that handles this output type
    return React.cloneElement(chosenOne, {
      cell: this.props.cell,
      id: this.props.id,
      contentRef: this.props.contentRef
    });
  }
}

const mapStateToProps = (state: AppState, ownProps: ComponentProps) => {
  const { id, contentRef } = ownProps;
  const model = selectors.model(state, { contentRef });
  let cell = undefined;

  if (model && model.type === "notebook") {
    cell = selectors.notebook.cellById(model, { id });
  }

  return { cell };
};

export default connect(mapStateToProps)(Cell);
