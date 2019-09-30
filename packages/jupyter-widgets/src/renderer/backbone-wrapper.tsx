import Backbone from "backbone";
import * as React from "react";

import * as Widgets from "@jupyter-widgets/controls";

interface Props {
  model: Backbone.Model;
}

export default class BackboneWrapper extends React.Component<Props> {
  widgetContainerRef: React.RefObject<HTMLDivElement>;

  constructor(props: Props) {
    super(props);
    this.widgetContainerRef = React.createRef<HTMLDivElement>();
  }

  componentDidMount() {
    const { model } = this.props;
    const viewName: string = model.get("_view_name");
    if (viewName) {
      const WidgetView = (Widgets as { [index: string]: any })[viewName];
      const widget = new WidgetView({
        model,
        el: this.widgetContainerRef.current
      });
      widget.render();
    }
  }

  render() {
    return <div ref={this.widgetContainerRef} />;
  }
}
