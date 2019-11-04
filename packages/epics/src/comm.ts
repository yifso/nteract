import { ofMessageType, outputs } from "@nteract/messaging";
import { ofType, StateObservable } from "redux-observable";
import { ActionsObservable } from "redux-observable";
import { merge } from "rxjs";
import { filter, map, switchMap, takeUntil } from "rxjs/operators";

import {
  commMessageAction,
  CommMessageAction,
  commOpenAction,
  KILL_KERNEL_SUCCESSFUL,
  LAUNCH_KERNEL_SUCCESSFUL,
  NewKernelAction
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
        payload: { kernel }
      } = action;
      console.log("Inside output redirect epic");

      const outputRedirectAction$ = kernel.channels.pipe(
        ofMessageType("comm_msg"),
        filter((message: any) => {
          const { comm_id, data } = message.content;
          if (
            data.method === "update" &&
            data.state.msg_id &&
            data.state.msg_id !== ""
          ) {
            return true;
          }
        }),
        switchMap((message: any) => {
          const processOutput$ = kernel.channels.pipe(
            outputs(),
            map((output: OnDiskOutput) => console.log(output))
          );

          const processClearOutput$ = kernel.channels.pipe(
            ofMessageType("clear_output"),
            map((msg: any) => console.log(msg))
          );

          return merge(processOutput$, processClearOutput$);
        }),
        takeUntil(action$.pipe(ofType(KILL_KERNEL_SUCCESSFUL)))
      );

      return outputRedirectAction$;
    })
  );
