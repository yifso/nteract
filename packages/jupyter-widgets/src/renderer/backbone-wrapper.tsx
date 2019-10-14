import * as React from "react";
require("jquery-ui/ui/widgets/slider");

type Indexed = { [index: string]: any };

interface Props {
  model: Indexed;
  manager: any;
  model_id: any;
  widgetContainerRef: any;
}

export default class BackboneWrapper extends React.Component<Props> {
  async componentDidUpdate() {
    const { model, manager, widgetContainerRef } = this.props;
    if (manager) {
      const managerModel = await manager.new_model({
        model_id: this.props.model_id,
        model_name: model._model_name,
        model_module: model._model_module,
        model_module_version: model._module_version,
        view_name: model._view_name,
        view_module: model._view_module,
        view_module_version: model._view_module_version
      });
      const WidgetView = await manager.loadClass(
        managerModel.get("_view_name"),
        managerModel.get("_view_module"),
        managerModel.get("_view_module_version")
      );
      const widget = new WidgetView({
        model: managerModel,
        el: widgetContainerRef.current
      });
      widget.render();
    }
  }

  render() {
    return <div ref={this.props.widgetContainerRef} />;
  }
}
