import { KernelMessage } from "@jupyterlab/services";
import * as base from "@jupyter-widgets/base";
import * as controls from "@jupyter-widgets/controls";
import {Widget as PhosphorWidget} from "@phosphor/widgets";
import { DOMWidgetView } from "@jupyter-widgets/base";

export class WidgetManager extends base.ManagerBase<DOMWidgetView> {
    el: HTMLElement;

    constructor(el: HTMLElement) {
        super();
        this.el = el;
    }

    loadClass(className: string, moduleName: string, moduleVersion:string): any {
        return new Promise(function(resolve, reject) {
            if (moduleName === '@jupyter-widgets/controls') {
                resolve(controls);
            } else if (moduleName === '@jupyter-widgets/base') {
                resolve(base)
            } else {
                return Promise.reject(`Module ${moduleName}@${moduleVersion} not found`);
            }
        }).then(function(module: any) {
            if (module[className]) {
                return module[className];
            } else {
                return Promise.reject(`Class ${className} not found in module ${moduleName}@${moduleVersion}`);
            }
        });
    }

    display_view(msg: KernelMessage.IMessage, view: base.DOMWidgetView, options:any): Promise<base.DOMWidgetView> {
        var that = this;
        return Promise.resolve(view).then(function(view) {
            PhosphorWidget.attach(view.pWidget, that.el);
            view.on('remove', function() {
                console.log('View removed', view);
            });
            return view;
        });
    };

    _get_comm_info() {
        return Promise.resolve({});
    };

    _create_comm() {
        return Promise.reject('no comms available');
    }
}