import * as React from "react";
import ReactDOM from "react-dom";

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
  private _outputs: any;
  initialize(attributes: any, options: any) {
    console.log(options);
    const { model_id } = options;
    const outputs = options.widget_manager.outputsByModelId(model_id);
    this.model_id = model_id;
    this._outputs = outputs;
    this.comm = options.comm;
    this.widget_manager = options.widget_manager;
  }

  callbacks() {
    return super.callbacks();
  }
}

export class OutputView extends output.OutputView {
  model: OutputModel;

  render() {
    ReactDOM.render(
      <Outputs>
        {this.model._outputs.map((output, key) => {
          console.log(output.toJS());
          return (
            <Output output={output} key={key}>
              <StreamText />
              <KernelOutputError />
            </Output>
          );
        })}
      </Outputs>,
      this.pWidget.node
    );
  }
}
