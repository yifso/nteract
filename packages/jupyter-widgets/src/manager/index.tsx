import * as React from "react";
import { WidgetManager } from "../renderer/widget-manager";
import Renderer from "../renderer";
import BackboneWrapper from "../renderer/backbone-wrapper";
import { connect } from "react-redux";
import { Dispatch } from "redux";

interface Props {
  model: any;
  model_id: any;
  dispatch: Dispatch;
}

interface State {
  manager?: WidgetManager
}

class Manager extends React.Component<Props, State> {
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
        <BackboneWrapper
          model={this.props.model.get("state").toJS()}
          manager={this.state.manager}
          model_id={this.props.model_id}
          widgetContainerRef={this.widgetContainerRef}
        />
      </React.Fragment>
    );
  }
}

export default connect(null, dispatch => {return {dispatch: dispatch}})(Manager);

