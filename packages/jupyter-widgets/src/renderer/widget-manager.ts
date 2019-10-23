import { KernelMessage } from "@jupyterlab/services";
import * as base from "@jupyter-widgets/base";
import * as controls from "@jupyter-widgets/controls";
import {
  DOMWidgetView,
  WidgetModel,
  WidgetView,
  DOMWidgetModel,
  ModelOptions,
  ISerializers
} from "@jupyter-widgets/base";
import { WidgetComm } from "./widget-comms";
import { Dispatch } from "redux";
import { connect } from "react-redux";

export class WidgetManager extends base.ManagerBase<DOMWidgetView> {
  model_comm_lookup: (id: string)=>any;
  kernel: any;

  constructor(kernel: any, model_comm_lookup: (id: string)=>any) {
    super();
    this.kernel = kernel;
    this.model_comm_lookup = model_comm_lookup;
  }

  init(kernel: any, model_comm_lookup: (id: string)=>any) {
    this.kernel = kernel;
    this.model_comm_lookup = model_comm_lookup;
  }

  loadClass(className: string, moduleName: string, moduleVersion: string): any {
    return new Promise(function(resolve, reject) {
      if (moduleName === "@jupyter-widgets/controls") {
        resolve(controls);
      } else if (moduleName === "@jupyter-widgets/base") {
        resolve(base);
      } else {
        return Promise.reject(
          `Module ${moduleName}@${moduleVersion} not found`
        );
      }
    }).then(function(module: any) {
      if (module[className]) {
        return module[className];
      } else {
        return Promise.reject(
          `Class ${className} not found in module ${moduleName}@${moduleVersion}`
        );
      }
    });
  }

  get_model(model_id: string): Promise<WidgetModel> | undefined {
    let model = super.get_model(model_id);
    if(model === undefined){
      let model_state = this.model_comm_lookup(model_id).state;
      model = this.new_model_from_state_and_id(model_state, model_id);
    }
    return model;
  }

  async new_model_from_state_and_id(state: any, model_id: string){
    let modelInfo = {
      model_id: model_id,
      model_name: state._model_name,
      model_module: state._model_module,
      model_module_version: state._module_version,
      view_name: state._view_name,
      view_module: state._view_module,
      view_module_version: state._view_module_version
    };
    console.log("modelinfo", modelInfo, state, model_id);
    return this.new_model(modelInfo, state);
  }

  async new_widget_from_state_and_id(state: any, model_id: string){
    let modelInfo = {
      model_id: model_id,
      model_name: state._model_name,
      model_module: state._model_module,
      model_module_version: state._module_version,
      view_name: state._view_name,
      view_module: state._view_module,
      view_module_version: state._view_module_version
    };
    return this.new_widget(modelInfo, state);
  }

  new_widget(options: any, serialized_state: any = {}): Promise<WidgetModel>{
    let widget = super.get_model(options.model_id);
    if(!widget){
      widget = super.new_widget(options, serialized_state);
    }
    return widget;
  }

  display_view(
    msg: KernelMessage.IMessage,
    view: base.DOMWidgetView,
    options: any
  ): Promise<base.DOMWidgetView> {
    return Promise.resolve(view);
  }

  _get_comm_info() {
    return Promise.resolve({});
  }

  _create_comm(comm_target_name: string,
    model_id: string,
    data?: any,
    metadata?: any,
    buffers?: ArrayBuffer[] | ArrayBufferView[]) {
    console.log("_create_comm called");
    return Promise.resolve(new WidgetComm(model_id, this.comm_target_name, "not used", this.kernel));
  }
}