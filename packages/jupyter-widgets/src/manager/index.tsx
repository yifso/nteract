import * as React from "react";
import BackboneWrapper from "../renderer/backbone-wrapper";
import { WidgetManager } from "./manager";
import { WidgetModel } from "@jupyter-widgets/base";

interface Props {
  model: WidgetModel;
  model_id: string;
}

interface State {
  manager?: WidgetManager;
}

/**
 * This component is is a wrapper component that initializes a
 * WidgetManager singleton and passes a model reference to the
 * BackboneModelWrapper. It's doing most of the heavy lifting with
 * respect to bridging the kernels comms that the WidgetManager provides,
 * our client-side state model, and the view.
 */
export default class Manager extends React.Component<Props, State> {
  widgetContainerRef = React.createRef<HTMLDivElement>();

  constructor(props: Props) {
    super(props);
    this.state = {
      manager: undefined
    };
  }

  componentDidMount() {
    if (this.widgetContainerRef && this.widgetContainerRef.current !== null) {
      this.setState({
        manager: new WidgetManager(this.widgetContainerRef.current)
      });
    }
  }

  render() {
    return (
      <React.Fragment>
        {this.props.model ? (
          <BackboneWrapper
            model={this.props.model.get("state").toJS()}
            manager={this.state.manager}
            model_id={this.props.model_id}
            widgetContainerRef={this.widgetContainerRef}
          />
        ) : null}
      </React.Fragment>
    );
  }
}
