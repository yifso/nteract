import { KernelMessage } from "@jupyterlab/services";
import * as base from "@jupyter-widgets/base";
import * as controls from "@jupyter-widgets/controls";
import { DOMWidgetView, DOMWidgetModel } from "@jupyter-widgets/base";
import { Dispatch } from "redux";

export class WidgetManager extends base.ManagerBase<DOMWidgetView> {
  el: HTMLElement;
  dispatch: Dispatch;

  constructor(el: HTMLElement, dispatch: Dispatch) {
    super();
    this.el = el;
    this.dispatch = dispatch;
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

  _create_comm(
    comm_target_name: string,
    model_id: string,
    data?: any,
    metadata?: any,
    buffers?: ArrayBuffer[] | ArrayBufferView[]
  ) {
    return Promise.resolve(null as any);
  }

  async create_view(
    model: DOMWidgetModel,
    options: any
  ): Promise<DOMWidgetView> {
    const managerModel = await this.new_model(
      {
        model_id: model.model_id,
        model_name: model._model_name,
        model_module: model._model_module,
        model_module_version: model._module_version,
        view_name: model._view_name,
        view_module: model._view_module,
        view_module_version: model._view_module_version
      },
      model
    );
    managerModel.on("change", (model: any) => {
      console.log(model);
    });
    return this.loadClass(
      managerModel.get("_view_name"),
      managerModel.get("_view_module"),
      managerModel.get("_view_module_version")
    );
  }
}
