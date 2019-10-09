import * as React from "react";

interface JupyterWidgetData {
  model_id: string;
  version_major: number;
  version_minor: number;
}

interface Props {
  data: JupyterWidgetData;
}

export default class WidgetDisplay extends React.Component<Props> {
  static MIMETYPE = "application/vnd.jupyter.widget-view+json";

  render() {
    return <pre>WidgetDisplay implementation is in progress.</pre>;
  }
}
