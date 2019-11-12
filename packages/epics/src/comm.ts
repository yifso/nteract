import { ofMessageType } from "@nteract/messaging";
import { ofType, StateObservable } from "redux-observable";
import { ActionsObservable } from "redux-observable";
import { merge } from "rxjs";
import { map, switchMap, takeUntil } from "rxjs/operators";

import {
  commMessageAction,
  commOpenAction,
  KILL_KERNEL_SUCCESSFUL,
  LAUNCH_KERNEL_SUCCESSFUL,
  NewKernelAction
} from "@nteract/actions";
import selectors from "@nteract/selectors";
import { AppState } from "@nteract/types";

import { ipywidgetsModel$ } from "./ipywidgets";

/**
 * An epic that emits comm actions from the backend kernel
 * @param  {ActionsObservable} action$ Action Observable from redux-observable
 * @param  {redux.Store} store   the redux store
 * @return {ActionsObservable}         Comm actions
 */
export const commListenEpic = (
  action$: ActionsObservable<NewKernelAction>,
  state$: StateObservable<AppState>
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

      return merge(
        ipywidgetsModel$(kernel, model, contentRef),
        commOpenAction$,
        commMessageAction$
      );
    })
  );
