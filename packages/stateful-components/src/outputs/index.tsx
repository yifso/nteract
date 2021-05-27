import Immutable from "immutable";
import React from "react";
import { connect } from "react-redux";

import { AppState, ContentRef, selectors } from "@nteract/core";
import { Output } from "@nteract/outputs";

const AUTO_SCROLL_HEIGHT_THRESHOLD = 1800;

type ScrolledValue = boolean | "auto";

interface ComponentProps {
  id: string;
  contentRef: ContentRef;
  children: React.ReactNode;
}

interface StateProps {
  hidden: boolean;
  scrolledValue: ScrolledValue;
  outputs: Immutable.List<any>;
}

type Props = ComponentProps & StateProps;

interface State {
  computedScrolledValue: boolean;
}

export class Outputs extends React.PureComponent<Props, State> {
  private readonly wrapperRef: React.RefObject<HTMLDivElement>;

  constructor(props: Props) {
    super(props);
    this.state = { computedScrolledValue: props.scrolledValue === "auto" ? false : props.scrolledValue };
    this.wrapperRef = React.createRef();
  }

  static getDerivedStateFromProps(props: Props, state: State) : Partial<State> | null {
    if (props.scrolledValue === true || props.scrolledValue === false) {
      // When scrolled value is explicitly true or false, then computed scroll value will be identical to original scroll value.
      return { computedScrolledValue: props.scrolledValue };
    } else {
      // When scrolled value is "auto", then computed scrolled value will be set in componentDidMount and componentDidUpdate. Don't update it here.
      return null
    }
  }

  render() {
    const { outputs, children, hidden } = this.props;
    const { computedScrolledValue } = this.state;
    const expanded = !computedScrolledValue;
    return (
      <div
        className={`nteract-cell-outputs ${hidden ? "hidden" : ""} ${
          expanded ? "expanded" : ""
        }`}
        ref={this.wrapperRef}
      >
        {outputs.map((output, index) => (
          <Output output={output} key={index}>
            {children}
          </Output>
        ))}
      </div>
    );
  }

  componentDidMount() {
    this.updateComputedScrolledValue();
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    this.updateComputedScrolledValue();
  }

  updateComputedScrolledValue() {
    if (this.props.scrolledValue !== "auto") {
      // Case when scrolledValue is true or false is already handled in getDerivedStateFromProps() for efficiency.
      return;
    }
    const wrapperDiv = this.wrapperRef.current;
    if (!wrapperDiv) {
      return;
    }
    // Using scrollHeight instead of offsetHeight to avoid adding another wrapper div.
    // "scrollHeight is a measurement of the height of an element's content, including content not visible on the screen due to overflow"
    const heightOfOutputs = wrapperDiv.scrollHeight;
    const shouldScroll = this.autoScrollShouldScroll(heightOfOutputs);
    if (shouldScroll != null && shouldScroll !== this.state.computedScrolledValue) {
      this.setState({ computedScrolledValue: shouldScroll })
    }
  }

  autoScrollShouldScroll(heightOfOutputs: number) {
    return heightOfOutputs > AUTO_SCROLL_HEIGHT_THRESHOLD;
  }
}

export const makeMapStateToProps = (
  initialState: AppState,
  ownProps: ComponentProps
): ((state: AppState) => StateProps) => {
  const mapStateToProps = (state: AppState): StateProps => {
    let outputs = Immutable.List();
    let hidden = false;
    let scrolledValue: ScrolledValue = "auto";

    const { contentRef, id } = ownProps;
    const model = selectors.model(state, { contentRef });

    if (model && model.type === "notebook") {
      const cell = selectors.notebook.cellById(model, { id });
      if (cell) {
        outputs = cell.get("outputs", Immutable.List());
        hidden =
          cell.cell_type === "code" &&
          cell.getIn(["metadata", "jupyter", "outputs_hidden"]);
        if (cell.cell_type === "code") {
          const rawScrolledValue = cell.getIn(["metadata", "scrolled"]);
          if (rawScrolledValue === true || rawScrolledValue === false) {
            scrolledValue = rawScrolledValue;
          } else {
            scrolledValue = "auto";
          }
        }
      }
    }

    return { outputs, hidden, scrolledValue };
  };
  return mapStateToProps;
};

export default connect<StateProps, void, ComponentProps, AppState>(
  makeMapStateToProps
)(Outputs);
