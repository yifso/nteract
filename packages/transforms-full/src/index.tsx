/**
 * Thus begins our path for custom mimetypes and future extensions
 */

import { WidgetDisplay } from "@nteract/jupyter-widgets";
import DataResourceTransform from "@nteract/transform-dataresource";
import GeoJSONTransform from "@nteract/transform-geojson";
import ModelDebug from "@nteract/transform-model-debug";
import PlotlyTransform, {
  PlotlyNullTransform
} from "@nteract/transform-plotly";
import { Vega2, Vega3, VegaLite1, VegaLite2 } from "@nteract/transform-vega";
import {
  registerTransform,
  richestMimetype,
  standardDisplayOrder,
  standardTransforms
} from "@nteract/transforms";

const additionalTransforms = [
  WidgetDisplay,
  DataResourceTransform,
  ModelDebug,
  PlotlyNullTransform,
  PlotlyTransform,
  GeoJSONTransform,
  VegaLite1,
  VegaLite2,
  Vega2,
  Vega3
];

const { transforms, displayOrder } = additionalTransforms.reduce(
  registerTransform,
  {
    transforms: standardTransforms,
    displayOrder: standardDisplayOrder
  }
);

export { displayOrder, transforms, richestMimetype, registerTransform };
