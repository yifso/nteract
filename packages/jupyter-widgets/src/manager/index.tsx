import * as React from "react";
import BackboneWrapper from "../renderer/backbone-wrapper";
import { WidgetManager } from "./manager";

interface Props {
  model: any;
  model_id: string;
}

interface State {
  manager?: WidgetManager;
}

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
