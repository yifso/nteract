// We might only need this as a devDependency as it is only here for flow
import { ImmutableOutput } from "@nteract/commutable";
import * as React from "react";

interface Props {
  /**
   * React elements that accept Output
   */
  children: React.ReactNode;
  /**
   * The raw output
   */
  output: ImmutableOutput;
}

export class Output extends React.PureComponent<Props> {
  static defaultProps = {
    output: null
  };

  render() {
    // We must pick only one child to render
    let chosenOne: React.ReactChild | null = null;

    if (this.props.output == null) {
      return null;
    }

    const output_type = this.props.output.output_type;

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
      if (
        childElement.props &&
        childElement.props.output_type &&
        childElement.props.output_type === output_type
      ) {
        chosenOne = childElement;
        return;
      }
    });

    // If we didn't find a match, render nothing
    if (chosenOne === null) {
      return null;
    }

    // Render the output component that handles this output type
    return React.cloneElement(chosenOne, this.props.output as any);
  }
}
