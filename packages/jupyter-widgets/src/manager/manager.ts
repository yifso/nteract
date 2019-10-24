import * as base from "@jupyter-widgets/base";
import { DOMWidgetModel, DOMWidgetView } from "@jupyter-widgets/base";
import * as controls from "@jupyter-widgets/controls";
import { KernelMessage } from "@jupyterlab/services";

interface IDomWidgetModel extends DOMWidgetModel {
  _model_name: string;
  _model_module: string;
  _module_version: string;
  _view_name: string;
  _view_module: string;
  _view_module_version: string;
}

/**
 * The WidgetManager extends the ManagerBase class and is required
 * by the ipywidgets implementation for rendering all models. This
 * WidgetManager contains some overrides to get it to play nice
 * with our RxJS-based kernel communication.
 */
export class WidgetManager extends base.ManagerBase<DOMWidgetView> {
  el: HTMLElement;

  constructor(el: HTMLElement) {
    super();
    this.el = el;
  }

  /**
   * Given a class name and module reference, this method will
   * attempt to resolve a reference to that module if it is found.
   * For non-supported widget models, this method will through
   * an error.
   *
   * @param className     The name of the WidgetView to load
   * @param moduleName    The module to load the widget from
   * @param moduleVersion The module version to laod from
   */
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

  /**
   * This method creates a view for a given model. It starts off
   * by registering a new model from the serialized model data. It
   * then uses the loadClass method to resolve a reference to the
   * WidgetView. Finally, it returns a reference to that Widget.
   * Note that we don't display the view here. Instead, we invoke
   * the `render` method on the WidgetView from within the
   * `BackboneWrapper` component and pass a reference to a React
   * element in this method.
   *
   * @param model   The Backbone-model associated with the widget
   * @param options Configuration options for rendering the widget
   */
  async create_view(
    model: DOMWidgetModel,
    options: any
  ): Promise<DOMWidgetView> {
    const managerModel = await this.new_model(
      {
        model_id: options.model_id,
        model_name: (model as IDomWidgetModel)._model_name,
        model_module: (model as IDomWidgetModel)._model_module,
        model_module_version: (model as IDomWidgetModel)._module_version,
        view_name: (model as IDomWidgetModel)._view_name,
        view_module: (model as IDomWidgetModel)._view_module,
        view_module_version: (model as IDomWidgetModel)._view_module_version
      },
      model
    );
    const WidgetView = await this.loadClass(
      managerModel.get("_view_name"),
      managerModel.get("_view_module"),
      managerModel.get("_view_module_version")
    );
    const widget = new WidgetView({
      model: managerModel,
      el: options.el || this.el
    });
    return widget;
  }
}
