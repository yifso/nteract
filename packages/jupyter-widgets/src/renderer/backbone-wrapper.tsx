import Backbone from "backbone";
import * as React from "react";

import * as Widgets from "@jupyter-widgets/controls";

type Indexed = { [index: string]: any };

interface Props {
  model: Indexed;
}

export default class BackboneWrapper extends React.Component<Props> {
  widgetContainerRef: React.RefObject<HTMLDivElement>;

  constructor(props: Props) {
    super(props);
    this.widgetContainerRef = React.createRef<HTMLDivElement>();
  }

  componentDidMount() {
    const { model } = this.props;
    const viewName: string = model["_view_name"];
    const modelName: string = model["_model_name"];
    if (viewName) {
      const WidgetView = (Widgets as Indexed)[viewName];
      const WidgetModel = (Widgets as Indexed)[modelName];
      const widget = new WidgetView({
        model: new WidgetModel(model),
        el: this.widgetContainerRef.current
      });
      widget.render();
    }
  }

  render() {
    return <div ref={this.widgetContainerRef} />;
  }
}
