import Backbone from "backbone";
import * as React from "react";

import * as Widgets from "@jupyter-widgets/controls";

interface Props {
  model: Backbone.Model;
}

export default class BackboneWrapper extends React.Component<Props> {
  static widgetContainerRef = React.createRef();

  componentDidMount() {
    const viewName = model.get("_view_name");
    if (viewName) {
      const WidgetView = Widgets[viewName];
      const widget = new WidgetView({
        model: this.props.model,
        el: this.widgetContainerRef.current
      });
      widget.render();
    }
  }

  render() {
    return <div ref={this.widgetContainerRef} />;
  }
}
