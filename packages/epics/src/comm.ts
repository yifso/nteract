import { ofMessageType, JupyterMessage } from "@nteract/messaging";
import { ofType } from "redux-observable";
import { ActionsObservable } from "redux-observable";
import { merge, of } from "rxjs";
import { map, filter, switchMap, takeUntil } from "rxjs/operators";

import {
  commMessageAction,
  commOpenAction,
  KILL_KERNEL_SUCCESSFUL,
  LAUNCH_KERNEL_SUCCESSFUL,
  NewKernelAction,
  appendOutput
} from "@nteract/actions";

import { selectors } from "@nteract/core";

/**
 * An epic that emits comm actions from the backend kernel
 * @param  {ActionsObservable} action$ Action Observable from redux-observable
 * @param  {redux.Store} store   the redux store
 * @return {ActionsObservable}         Comm actions
 */
export const commListenEpic = (
  action$: ActionsObservable<NewKernelAction>,
  state$
) =>
  action$.pipe(
    // A LAUNCH_KERNEL_SUCCESSFUL action indicates we have a new channel
    ofType(LAUNCH_KERNEL_SUCCESSFUL),
    switchMap((action: NewKernelAction) => {
      const {
        payload: { kernel, contentRef }
      } = action;
      /**
       * We need the model of the currently loaded notebook so we can
       * determine what notebook to render the output of the widget onto.
       */
      const model = selectors.model(state$.value, { contentRef });
      /**
       * Listen for comm_open messages from the kernel that are associated
       * with models that will not be rendered on the page.
       */
      const ipywidgetsModel$ = kernel.channels.pipe(
        ofMessageType("comm_open"),
        filter((msg: JupyterMessage) => {
          if (msg.content.data.state._model_name === "LinkModel") {
            return true;
          }
          return false;
        }),
        switchMap((msg: JupyterMessage) =>
          of(
            commOpenAction(msg),
            /**
             * If the content we are running under is a notebook,
             * then append a mock output for the linkModel to the
             * notebook.
             */
            model && model.type === "notebook"
              ? appendOutput({
                  /**
                   * We currently append the output to the first cell
                   * in the notebook. Since we are just doing this to
                   * get the LinkModel loaded into our WidgetManager
                   * singleton, it doesn't matter which cell it is rendered
                   * under.
                   *
                   * However, this approach is rather messy since this
                   * output will be serialized to the notebook. TODO: we
                   * should try to get the cell that contained the jslink
                   * code and store the tempoary output there.
                   */
                  id: model.notebook.cellOrder.first(),
                  contentRef,
                  output: {
                    output_type: "display_data",
                    data: {
                      "application/vnd.jupyter.widget-view+json": {
                        model_id: msg.content.comm_id,
                        version_major: 2,
                        version_minor: 0
                      }
                    },
                    metadata: {},
                    transient: {}
                  }
                })
              : null
          )
        ),
        takeUntil(action$.pipe(ofType(KILL_KERNEL_SUCCESSFUL)))
      );

      // Listen on the comms channel until KILL_KERNEL_SUCCESSFUL is emitted
      const commOpenAction$ = kernel.channels.pipe(
        ofMessageType("comm_open"),
        map(commOpenAction),
        takeUntil(action$.pipe(ofType(KILL_KERNEL_SUCCESSFUL)))
      );

      const commMessageAction$ = kernel.channels.pipe(
        ofMessageType("comm_msg"),
        map(commMessageAction),
        takeUntil(action$.pipe(ofType(KILL_KERNEL_SUCCESSFUL)))
      );

      return merge(ipywidgetsModel$, commOpenAction$, commMessageAction$);
    })
  );
