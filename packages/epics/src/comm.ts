import { JupyterMessage, ofMessageType, outputs } from "@nteract/messaging";
import { ofType } from "redux-observable";
import { ActionsObservable } from "redux-observable";
import { merge } from "rxjs";
import { filter, map, switchMap, takeUntil } from "rxjs/operators";

import {
  clearOutputInModel,
  commMessageAction,
  commOpenAction,
  KILL_KERNEL_SUCCESSFUL,
  LAUNCH_KERNEL_SUCCESSFUL,
  NewKernelAction,
  redirectOutputToModel
} from "@nteract/actions";

/**
 * An epic that emits comm actions from the backend kernel
 * @param  {ActionsObservable} action$ Action Observable from redux-observable
 * @param  {redux.Store} store   the redux store
 * @return {ActionsObservable}         Comm actions
 */
export const commListenEpic = (action$: ActionsObservable<NewKernelAction>) =>
  action$.pipe(
    // A LAUNCH_KERNEL_SUCCESSFUL action indicates we have a new channel
    ofType(LAUNCH_KERNEL_SUCCESSFUL),
    switchMap((action: NewKernelAction) => {
      const {
        payload: { kernel }
      } = action;
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

      return merge(commOpenAction$, commMessageAction$);
    })
  );

export const outputRedirectEpic = (
  action$: ActionsObservable<NewKernelAction>
) =>
  action$.pipe(
    ofType(LAUNCH_KERNEL_SUCCESSFUL),
    switchMap((action: NewKernelAction) => {
      const {
        payload: { kernel, contentRef }
      } = action;

      const outputRedirectAction$ = kernel.channels.pipe(
        ofMessageType("comm_msg"),
        filter((message: any) => {
          const { data } = message.content;
          return (
            data.method === "update" &&
            data.state.msg_id &&
            data.state.msg_id !== ""
          );
        }),
        switchMap((message: JupyterMessage) => {
          const { comm_id } = message.content;
          const processOutput$ = kernel.channels.pipe(
            outputs(),
            map((output: any) => {
              return redirectOutputToModel({
                modelId: comm_id,
                output,
                contentRef
              });
            })
          );

          const processClearOutput$ = kernel.channels.pipe(
            ofMessageType("clear_output"),
            map((msg: JupyterMessage) =>
              clearOutputInModel({ modelId: comm_id })
            )
          );

          return merge(processOutput$, processClearOutput$).pipe(
            takeUntil(
              kernel.channels.pipe(
                ofMessageType("comm_msg"),
                filter((msg: JupyterMessage) => {
                  const { data } = msg.content;
                  return data.method === "update" && !data.state.msg_id;
                })
              )
            )
          );
        }),
        takeUntil(action$.pipe(ofType(KILL_KERNEL_SUCCESSFUL)))
      );

      return outputRedirectAction$;
    })
  );
