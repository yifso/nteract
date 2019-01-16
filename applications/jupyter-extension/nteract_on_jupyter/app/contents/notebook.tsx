import { ContentRef } from "@nteract/core";
import {
  displayOrder as defaultDisplayOrder,
  transforms as defaultTransforms
} from "@nteract/transforms";
import * as React from "react";
import { connect } from "react-redux";

// Show nothing while loading the notebook app
const NotebookPlaceholder = (props: any) => null;

interface State {
  App: React.ComponentType<Props>;
}

interface Props {
  contentRef: ContentRef;
}

class Notebook extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      App: NotebookPlaceholder
    };
  }

  registerTransform(transform: { MIMETYPE: string }) {
    this.setState(prevState => {
      return {
        transforms: { ...prevState.transforms, [transform.MIMETYPE]: transform }
      };
    });
  }

  loadApp() {
    import(/* webpackChunkName: "notebook-app-component" */ "@nteract/notebook-app-component").then(
      module => {
        this.setState({ App: module.default });
      }
    );
  }

  loadTransforms() {
    import(/* webpackChunkName: "plotly" */ "@nteract/transform-plotly").then(
      module => {
        this.registerTransform(module.default);
        this.registerTransform(module.PlotlyNullTransform);
      }
    );

    import(/* webpackChunkName: "tabular-dataresource" */ "@nteract/transform-dataresource").then(
      module => {
        this.registerTransform(module.default);
      }
    );

    import(/* webpackChunkName: "jupyter-widgets" */ "@nteract/jupyter-widgets").then(
      module => {
        this.registerTransform(module.WidgetDisplay);
      }
    );

    import("@nteract/transform-model-debug").then(module => {
      this.registerTransform(module.default);
    });

    import(/* webpackChunkName: "vega-transform" */ "@nteract/transform-vega").then(
      module => {
        this.setState(prevState => {
          return {
            transforms: {
              ...prevState.transforms,
              [module.VegaLite1.MIMETYPE]: module.VegaLite1,
              [module.VegaLite2.MIMETYPE]: module.VegaLite2,
              [module.Vega2.MIMETYPE]: module.Vega2,
              [module.Vega3.MIMETYPE]: module.Vega3
            }
          };
        });
      }
    );

    // TODO: The geojson transform will likely need some work because of the basemap URL(s)
    // import GeoJSONTransform from "@nteract/transform-geojson";
  }

  componentDidMount() {
    this.loadApp();
    this.loadTransforms();
  }

  render() {
    const App = this.state.App;

    return <App contentRef={this.props.contentRef} />;
  }
}
