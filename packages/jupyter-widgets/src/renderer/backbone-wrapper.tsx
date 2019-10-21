import * as React from "react";

/**
 * Import the styles for jupyter-widgets. This overrides some of the
 * styles that jQuery applies to the widgets.
 */
// import "@jupyter-widgets/base/css/index.css";
import "@jupyter-widgets/controls/css/widgets-base.css";
import "@jupyter-widgets/controls/css/phosphor.css";
import "@jupyter-widgets/controls/css/widgets.css";
import "@jupyter-widgets/controls/css/labvariables.css";
import "@jupyter-widgets/controls/css/materialcolors.css";

/**
 * Bring in the JavaScript and CSS for rendering the
 * widgets that require jQuery-UI.
 */
require("jquery-ui/themes/base/all.css");
require("jquery-ui/themes/base/core.css");
require("jquery-ui/themes/base/base.css");
require("jquery-ui/themes/base/theme.css");

// Widget-specific CSS
require("jquery-ui/themes/base/accordion.css");
require("jquery-ui/themes/base/autocomplete.css");
require("jquery-ui/themes/base/button.css");
require("jquery-ui/themes/base/checkboxradio.css");
require("jquery-ui/themes/base/controlgroup.css");
require("jquery-ui/themes/base/datepicker.css");
require("jquery-ui/themes/base/dialog.css");
require("jquery-ui/themes/base/draggable.css");
require("jquery-ui/themes/base/menu.css");
require("jquery-ui/themes/base/progressbar.css");
require("jquery-ui/themes/base/resizable.css");
require("jquery-ui/themes/base/selectable.css");
require("jquery-ui/themes/base/selectmenu.css");
require("jquery-ui/themes/base/slider.css");
require("jquery-ui/themes/base/sortable.css");
require("jquery-ui/themes/base/spinner.css");
require("jquery-ui/themes/base/tabs.css");
require("jquery-ui/themes/base/tooltip.css");

type Indexed = { [index: string]: any };

interface Props {
  model: any;
  manager: any;
  model_id: any;
  widgetContainerRef: any;
}

export default class BackboneWrapper extends React.Component<Props> {
  widget: any = undefined;
  constructor(props: any){
    super(props)
  }
  async componentDidUpdate() {
    const { model, manager, widgetContainerRef } = this.props;
    if (manager && this.widget === undefined) {
      this.widget = null;
      const managerModel = await manager.new_widget({
        model_id: this.props.model_id,
        model_name: model._model_name,
        model_module: model._model_module,
        model_module_version: model._module_version,
        view_name: model._view_name,
        view_module: model._view_module,
        view_module_version: model._view_module_version
      }, model);
      //managerModel.on("change", (model: any) => {console.log(model)});
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
      this.widget = widget;
      //console.log("thiswidget", this.widget);
    }
  }

  render() {
    return <div ref={this.props.widgetContainerRef} />;
  }
}
