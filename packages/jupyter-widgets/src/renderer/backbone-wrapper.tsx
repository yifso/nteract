import * as React from "react";
import { WidgetManager } from "../manager/manager";

/**
 * Import the styles for jupyter-widgets. This overrides some of the
 * styles that jQuery applies to the widgets.
 */
import "@jupyter-widgets/base/css/index.css";
import "@jupyter-widgets/controls/css/labvariables.css";
import "@jupyter-widgets/controls/css/materialcolors.css";
import "@jupyter-widgets/controls/css/phosphor.css";
import "@jupyter-widgets/controls/css/widgets-base.css";
import "@jupyter-widgets/controls/css/widgets.css";

/**
 * Bring in the JavaScript and CSS for rendering the
 * widgets that require jQuery-UI.
 */
require("jquery-ui/themes/base/all.css");
require("jquery-ui/themes/base/core.css");
require("jquery-ui/themes/base/base.css");
require("jquery-ui/themes/base/theme.css");

interface Props {
  model: any;
  manager?: WidgetManager;
  model_id: string;
  widgetContainerRef: React.RefObject<HTMLDivElement>;
}

export default class BackboneWrapper extends React.Component<Props> {
  async componentDidUpdate() {
    const { model, manager, widgetContainerRef } = this.props;
    if (manager) {
      const widget = await manager.create_view(model, {
        model_id: this.props.model_id,
        el: widgetContainerRef.current
      });
      widget.render();
    }
  }

  render() {
    return <div ref={this.props.widgetContainerRef} />;
  }
}
