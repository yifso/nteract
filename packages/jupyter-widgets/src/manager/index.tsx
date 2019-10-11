import * as React from "react";
import { WidgetManager } from "../renderer/widget-manager";
import Renderer from "../renderer";
import BackboneWrapper from "../renderer/backbone-wrapper";

interface Props {
  model: any;
  model_id: any;
}

export default class Manager extends React.Component<Props> {
  ref = React.createRef<HTMLDivElement>();

  constructor(props: Props) {
    super(props);
    this.state = {
      manager: new WidgetManager(this.ref.current as HTMLElement)
    };
  }

  render() {
    console.log(this.props);
    return (
      <React.Fragment>
        <div ref={this.ref} />
        <BackboneWrapper
          model={this.props.model.get("state").toJS()}
          manager={this.state.manager}
          model_id={this.props.model_id}
        />
      </React.Fragment>
    );
  }
}
