import * as React from "react";

import * as output from "@jupyter-widgets/output";

import {
  KernelOutputError,
  Media,
  Output,
  RichMedia,
  StreamText
} from "@nteract/outputs";

import WidgetManager from "../manager/widget-manager";

import { Outputs } from "@nteract/presentational-components";

import Immutable from "immutable";

export const OUTPUT_WIDGET_VERSION = output.OUTPUT_WIDGET_VERSION;

export class OutputModel extends output.OutputModel {
  initialize(attributes: any, options: any) {
    const { model_id } = options;
    console.log(model_id);
    const outputs = options.widget_manager.outputsByModelId(model_id);
    console.log(outputs);
  }
}

export class OutputView extends output.OutputView {
  render() {
    return null;
  }
}
