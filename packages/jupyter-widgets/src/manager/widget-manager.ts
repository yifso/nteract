import { KernelMessage } from "@jupyterlab/services";
import * as base from "@jupyter-widgets/base";
import * as controls from "@jupyter-widgets/controls";
import * as pWidget from "@phosphor/widgets";
import {
  DOMWidgetView,
  WidgetModel,
  DOMWidgetModel
} from "@jupyter-widgets/base";
import { WidgetComm } from "./widget-comms";
import { RecordOf } from "immutable";
import {
  KernelNotStartedProps,
  LocalKernelProps,
  RemoteKernelProps
} from "@nteract/core";

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
  stateModelById: (id: string) => any;
  kernel:
    | RecordOf<KernelNotStartedProps>
    | RecordOf<LocalKernelProps>
    | RecordOf<RemoteKernelProps>
    | null;
  widgetsBeingCreated: Promise<WidgetModel>[];

  constructor(kernel: any, stateModelById: (id: string) => any) {
    super();
    this.kernel = kernel;
    this.stateModelById = stateModelById;
    this.widgetsBeingCreated = [];
  }

  update(kernel: any, stateModelById: (id: string) => any) {
    this.kernel = kernel;
    this.stateModelById = stateModelById;
  }

  /**
   * Load a class and return a promise to the loaded object.
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

  /**
   * Get a promise for a model by model id.
   *
   * #### Notes
   * If a model is not found, this will lookup the model in nteracts
   * redux store using the model_comm_lookup funciton and create it
   */
  get_model(model_id: string): Promise<WidgetModel> | undefined {
    let model = super.get_model(model_id);
    if (model === undefined) {
      let model_state = this.stateModelById(model_id)
        .get("state")
        .toJS();
      model = this.new_widget_from_state_and_id(model_state, model_id);
    }
    return model;
  }

  /**
   * Shortcut to new_widget (creates the modelInfo from the state)
   * @param state
   * @param model_id
   */
  async new_widget_from_state_and_id(state: any, model_id: string) {
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

  /**
   * Create a comm and new widget model.
   * @param  options - same options as new_model but comm is not
   *                          required and additional options are available.
   * @param  serialized_state - serialized model attributes.
   */
  new_widget(options: any, serialized_state: any = {}): Promise<WidgetModel> {
    const model_id = options.model_id;
    if (super.get_model(model_id)) {
      //if this widget is already created
      return super.get_model(model_id)!; //we can assert that it's not undefined because we just checked
    } else if (this.widgetsBeingCreated[model_id]) {
      //if this widget is in the process of being created
      return this.widgetsBeingCreated[model_id];
    } else {
      let widget = super.new_widget(options, serialized_state);
      this.widgetsBeingCreated[model_id] = widget;
      return widget;
    }
  }

  /**
   * Do not use this method. Use `render_view` instead for displaying the widget.
   *
   * This method is here because it is required to be implemented by the ManagerBase,
   * so even though it is not used, do not delete it.
   * @param msg
   * @param view
   * @param options
   */
  display_view(
    msg: KernelMessage.IMessage,
    view: base.DOMWidgetView,
    options: any
  ): Promise<base.DOMWidgetView> {
    throw Error("display_view not implemented. Use render_view instead.");
  }

  /**
   * Render the given view to a target element
   * @param view View to be rendered
   * @param el Target element that the view will be rendered within
   */
  render_view(view: base.DOMWidgetView, el: HTMLElement): void {
    pWidget.Widget.attach(view.pWidget, el);
  }

  _get_comm_info() {
    return Promise.resolve({});
  }

  /**
   * Create a comm which can be used for communication for a widget.
   *
   * If the data/metadata is passed in, open the comm before returning (i.e.,
   * send the comm_open message). If the data and metadata is undefined, we
   * want to reconstruct a comm that already exists in the kernel, so do not
   * open the comm by sending the comm_open message.
   *
   * @param comm_target_name Comm target name
   * @param model_id The comm id
   * @param data The initial data for the comm
   * @param metadata The metadata in the open message
   */
  _create_comm(
    comm_target_name: string,
    model_id: string,
    data?: any,
    metadata?: any,
    buffers?: ArrayBuffer[] | ArrayBufferView[]
  ) {
    //TODO: Check if we need to open a comm
    //TODO: Find a way to supply correct target module (only used in comm opens)
    if (this.kernel) {
      return Promise.resolve(
        new WidgetComm(
          model_id,
          this.comm_target_name,
          "<target module>",
          this.kernel
        )
      );
    } else {
      return Promise.reject("Kernel is null or undefined");
    }
  }
}
