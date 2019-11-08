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
      const model = selectors.model(state$.value, { contentRef });
      // Listen for comm_open messages from the kernel that are associated
      // with models that will not be rendered on the page
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
            appendOutput({
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
