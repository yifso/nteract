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
  get outputs() {
    return this._outputs;
  }
  widget_manager: WidgetManager;

  private _outputs: Immutable.List;

  defaults() {
    return {
      ...super.defaults(),
      msg_id: "",
      outputs: []
    };
  }

  initialize(attributes: any, options: any) {
    console.log(attributes);
    console.log(options);
    super.initialize(attributes, options);
    this._outputs = Immutable.List([]);
    this._msgHook = msg => {
      this.add(msg);
      return false;
    };

    this.listenTo(this, "change:msg_id", this.resetMsgId);
    this.listenTo(this, "change:outputs", this.setOutputs);
    this.setOutputs();
  }

  clearOutputs(wait: boolean = false) {
    this._outputs = Immutable.List([]);
  }

  resetMsgId() {
    const kernel = this.widget_manager.kernel;
    const msgId = this.get("msg_id");
    const oldMsgId = this.previous("msg_id");
  }

  add(msg: any) {
    const msgType = msg.header.msg_type;
    switch (msgType) {
      case "execute_result":
      case "display_data":
      case "stream":
      case "error":
        const model = msg.content;
        model.output_type = msgType;
        this._outputs.add(model);
        break;
      case "clear_output":
        this.clearOutputs(msg.content.wait);
        break;
      default:
        break;
    }
    this.set("outputs", this._outputs.toJSON(), { newMessage: true });
    this.save_changes();
  }

  setOutputs(model?: any, value?: any, options?: any) {
    if (!(options && options.newMessage)) {
      this.clearOutputs();
      this.outputs = new Immutable.List(
        JSON.parse(JSON.stringify(this.getComputedStyle("outputs")))
      );
    }
  }
}

export class OutputView extends output.OutputView {
  model: OutputModel;

  _createElement() {
    console.log("createElement");
  }

  _setElement() {
    console.log("setElement");
  }

  render() {
    console.log(this.model.outputs);
    // return (
    //   <Outputs>
    //     {this.model.outputs.map((output, index) => (
    //       <Output output={output} key={index}>
    //         <RichMedia data={output}>
    //           <Media.Json />
    //           <Media.JavaScript />
    //           <Media.HTML />
    //           <Media.Markdown />
    //           <Media.LaTeX />
    //           <Media.SVG />
    //           <Media.Image />
    //           <Media.Plain />
    //         </RichMedia>
    //         <KernelOutputError />
    //         <StreamText />
    //       </Output>
    //     ))}
    //   </Outputs>
    // );
  }
}
