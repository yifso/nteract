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
  el: HTMLElement;
  dispatch: Dispatch;
  model_comm_lookup: (id: string)=>any;
  i = 0;

  constructor(el: HTMLElement, dispatch: Dispatch, model_comm_lookup: (id: string)=>any) {
    super();
    this.el = el;
    this.dispatch = dispatch;
    this.model_comm_lookup = model_comm_lookup;
    // WidgetModel.serializers = {
    //   ...WidgetModel.serializers,
    //   layout: {deserialize: unpack_models, serialize: pack_models},
    //   style: {deserialize: unpack_models},
    // };
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
    if(model === undefined && this.i < 10){
      let model_state = this.model_comm_lookup(model_id).state;
      model = this.new_model_from_state_and_id(model_state, model_id);
      this.i++;
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

  // async new_model(options: ModelOptions, serialized_state: any = {}): Promise<NteractWidgetModel> {
  //   return super.new_model(options, serialized_state)
  //     .then(model => {
  //       model.style = {};
  //       model.layout = {};
  //       return Promise.resolve(model);
  //     });
  // }

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
    return Promise.resolve(new WidgetComm(this.dispatch, model_id, this.comm_target_name, "not used"));
  }
}

class NteractWidgetModel extends WidgetModel {
  static serializers: ISerializers = {
      ...WidgetModel.serializers,
      layout: {deserialize: unpack_modelssss, serialize: pack_modelssss},
      style: {deserialize: unpack_modelssss, serialize: pack_modelssss},
  };
}

function unpack_modelssss(value?: any, manager?: base.ManagerBase<any>){
  console.log("deserialize", value);
  return value;
}
function pack_modelssss(value?: any, widget?: base.WidgetModel | undefined){
  console.log("serialize", value);
  return value.model_id;
}