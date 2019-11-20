import * as actions from "@nteract/actions";
import * as selectors from "@nteract/selectors";
import { KernelRef, createKernelRef } from "@nteract/types";

import { ActionsObservable, ofType } from "redux-observable";
import { empty, of, merge } from "rxjs";
import { concatMap, filter, take, timeout, catchError } from "rxjs/operators";

/**
 * Restarts a Jupyter kernel in the local scenario, where a restart requires
 * killing the existing kernel process and starting an ew one.
 */
export const restartKernelEpic = (
  action$: ActionsObservable<actions.RestartKernel | actions.NewKernelAction>,
  state$: any,
  kernelRefGenerator: () => KernelRef = createKernelRef
) =>
  action$.pipe(
    ofType(actions.RESTART_KERNEL),
    concatMap((action: actions.RestartKernel | actions.NewKernelAction) => {
      const state = state$.value;

      const oldKernelRef = selectors.kernelRefByContentRef(state$.value, {
        contentRef: action.payload.contentRef
      });

      const notificationSystem = selectors.notificationSystem(state);

      if (!oldKernelRef) {
        notificationSystem.addNotification({
          title: "Failure to Restart",
          message: "Unable to restart kernel, please select a new kernel.",
          dismissible: true,
          position: "tr",
          level: "error"
        });
        return empty();
      }

      const oldKernel = selectors.kernel(state, { kernelRef: oldKernelRef });

      if (oldKernel && oldKernel.type === "websocket") {
        return empty();
      }

      if (!oldKernelRef || !oldKernel) {
        notificationSystem.addNotification({
          title: "Failure to Restart",
          message: "Unable to restart kernel, please select a new kernel.",
          dismissible: true,
          position: "tr",
          level: "error"
        });

        // TODO: Wow do we need to send notifications through our store for
        // consistency
        return empty();
      }

      const newKernelRef = kernelRefGenerator();
      const initiatingContentRef = action.payload.contentRef;

      // TODO: Incorporate this into each of the launchKernelByName
      //       actions...
      //       This only mirrors the old behavior of restart kernel (for now)
      notificationSystem.addNotification({
        title: "Kernel Restarting...",
        message: `Kernel ${oldKernel.kernelSpecName ||
          "unknown"} is restarting.`,
        dismissible: true,
        position: "tr",
        level: "success"
      });

      const kill = actions.killKernel({
        restarting: true,
        kernelRef: oldKernelRef
      });

      const relaunch = actions.launchKernelByName({
        kernelSpecName: oldKernel.kernelSpecName,
        cwd: oldKernel.cwd,
        kernelRef: newKernelRef,
        selectNextKernel: true,
        contentRef: initiatingContentRef
      });

      const awaitKernelReady = action$.pipe(
        ofType(actions.LAUNCH_KERNEL_SUCCESSFUL),
        filter(
          (action: actions.NewKernelAction | actions.RestartKernel) =>
            action.payload.kernelRef === newKernelRef
        ),
        take(1),
        timeout(60000), // If kernel doesn't come up within this interval we will abort follow-on actions.
        concatMap(() => {
          const restartSuccess = actions.restartKernelSuccessful({
            kernelRef: newKernelRef,
            contentRef: initiatingContentRef
          });

          if (
            (action as actions.RestartKernel).payload.outputHandling ===
            "Run All"
          ) {
            return of(
              restartSuccess,
              actions.executeAllCells({ contentRef: initiatingContentRef })
            );
          } else {
            return of(restartSuccess);
          }
        }),
        catchError(error => {
          return of(
            actions.restartKernelFailed({
              error,
              kernelRef: newKernelRef,
              contentRef: initiatingContentRef
            })
          );
        })
      );

      return merge(of(kill, relaunch), awaitKernelReady);
    })
  );
