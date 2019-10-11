import Backbone from "backbone";
import * as React from "react";

import * as Widgets from "@jupyter-widgets/controls";
import { WidgetManager } from "./widget-manager";
import { WidgetView, WidgetModel } from "@jupyter-widgets/base";

type Indexed = { [index: string]: any };

interface Props {
  model: Indexed;
  manager: any;
  model_id: any;
}

export default class BackboneWrapper extends React.Component<Props> {
  widgetContainerRef: React.RefObject<HTMLDivElement>;

  constructor(props: Props) {
    super(props);
    this.widgetContainerRef = React.createRef<HTMLDivElement>();
  }

  async componentDidMount() {
    console.log(this.props);
    const { model } = this.props;
    console.log(model);
    const viewName: string = model["_view_name"];
    const modelName: string = model["_model_name"];
    if (viewName && this.widgetContainerRef.current !== null) {
      const manager = new WidgetManager(this.widgetContainerRef.current);
      let newModel = await manager.new_model(
        {
          model_id: this.props.model_id,
          model_name: model._model_name,
          model_module: model._model_module,
          model_module_version: model._module_version,
          view_name: model._view_name,
          view_module: model._view_module,
          view_module_version: model._view_module_version
        },
        model
      );
      console.dir(newModel);
      let newView = await manager.create_view(newModel, { manager });
      newView.render();
    }
  }

  render() {
    return <div ref={this.widgetContainerRef} />;
  }
}
