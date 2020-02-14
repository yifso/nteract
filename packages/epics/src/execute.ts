import {
  Channels,
  childOf,
  createExecuteRequest,
  ExecuteRequest,
  executionCounts,
  inputReply,
  inputRequests,
  JupyterMessage,
  kernelStatuses,
  MessageType,
  ofMessageType,
  outputs,
  payloads
} from "@nteract/messaging";
import { AnyAction } from "redux";
import { ofType } from "redux-observable";
import { ActionsObservable, StateObservable } from "redux-observable";
import {
  empty,
  merge,
  Observable,
  Observer,
  of,
  throwError,
  defer
} from "rxjs";
import {
  catchError,
  concatMap,
  distinct,
  filter,
  groupBy,
  map,
  mergeAll,
  mergeMap,
  share,
  switchMap,
  takeUntil,
  tap,
  withLatestFrom
} from "rxjs/operators";
import { extractNewKernel } from "./kernel-lifecycle";

import * as actions from "@nteract/actions";
import { CellId, OnDiskOutput } from "@nteract/commutable";
import * as selectors from "@nteract/selectors";
import {
  AppState,
  ContentRef,
  InputRequestMessage,
  KernelStatus,
  PayloadMessage
} from "@nteract/types";
import { List } from "immutable";

/**
 * Observe all the reactions to running code for cell with id.
 *
 * @param {Subject} channels - The standard channels specified in the Jupyter
 * specification.
 * @param {String} id - Universally Unique Identifier of cell to be executed.
 * @param {String} code - Source code to be executed.
 * @return {Observable<Action>} updatedOutputs - It returns an observable with
 * a stream of events that need to happen after a cell has been executed.
 */
export function executeCellStream(
  channels: Channels,
  id: string,
  message: ExecuteRequest,
  contentRef: ContentRef
) {
  if (!channels || !channels.pipe) {
    // Suspect for infinite EXECUTE_FAILED issue
    return throwError(new Error("kernel not connected"));
  }

  const executeRequest = message;

  // All the streams intended for all frontends
  const cellMessages: Observable<JupyterMessage<
    MessageType,
    any
  >> = channels.pipe(childOf(executeRequest), share());

  // All the payload streams, intended for one user
  // Be consistent about using $ at the end of an Obsevable
  const payloadStream = cellMessages.pipe(payloads());

  const cellAction$ = merge(
    payloadStream.pipe(
      map((payload: PayloadMessage) =>
        actions.acceptPayloadMessage({ id, payload, contentRef })
      )
    ),

    /**
     * Set the ISO datetime when the execute_input message
     * was broadcast from the kernel, per nbformat.
     */
    cellMessages.pipe(
      ofMessageType("execute_input"),
      map(() =>
        actions.setInCell({
          id,
          contentRef,
          path: ["metadata", "execution", "iopub.execute_input"],
          value: new Date().toISOString()
        })
      )
    ),

    /**
     * Set the ISO datetime when the execute_reply message
     * was broadcast from the kernel, per nbformat.
     */
    cellMessages.pipe(
      ofMessageType("execute_reply"),
      map(() =>
        actions.setInCell({
          id,
          contentRef,
          path: ["metadata", "execution", "shell.execute_reply"],
          value: new Date().toISOString()
        })
      )
    ),

    /**
     * Set the ISO datetime when the status associated with the
     * cell execution was sent from the kernel, per nbformat.
     */
    cellMessages.pipe(
      // Start naming these operators better: pluck, filter, pull
      kernelStatuses(),
      map((status: string) =>
        actions.setInCell({
          id,
          contentRef,
          path: ["metadata", "execution", `iopub.status.${status}`],
          value: new Date().toISOString()
        })
      )
    ),

    // All actions for updating cell status
    cellMessages.pipe(
      kernelStatuses(),
      map((status: string) =>
        actions.updateCellStatus({ id, status, contentRef })
      )
    ),

    // Update the input numbering: `[ ]`
    cellMessages.pipe(
      executionCounts(),
      map((ct: number) =>
        actions.updateCellExecutionCount({ id, value: ct, contentRef })
      )
    ),

    // All actions for new outputs
    cellMessages.pipe(
      outputs(),
      map((output: OnDiskOutput) =>
        actions.appendOutput({ id, output, contentRef })
      )
    ),

    // clear_output display message
    cellMessages.pipe(
      ofMessageType("clear_output"),
      map(() => actions.clearOutputs({ id, contentRef }))
    ),

    // Prompt the user for input
    cellMessages.pipe(
      inputRequests(),
      map((inputRequest: InputRequestMessage) => {
        return actions.promptInputRequest({
          id,
          contentRef,
          prompt: inputRequest.prompt,
          password: inputRequest.password
        });
      })
    )
  );

  /**
   * When someone subscribes, dispatch the messge to the kernel
   * by calling `channels.next` then process the responses by proxying
   * to the inner Observable (cellAction$).
   */
  return defer(() => {
    channels.next(executeRequest);
    return cellAction$;
  });
}

export function createExecuteCellStream(
  action$: Observable<
    | actions.ExecuteCanceled
    | actions.DeleteCell
    | actions.LaunchKernelAction
    | actions.LaunchKernelByNameAction
    | actions.KillKernelAction
    | actions.SendExecuteRequest
  >,
  state: any,
  message: ExecuteRequest,
  id: string,
  contentRef: ContentRef
): Observable<any> {
  // Move these guards to the top-level epic
  const kernel = selectors.kernelByContentRef(state, {
    contentRef
  });

  const channels = kernel ? kernel.channels : null;

  const kernelConnected =
    kernel &&
    channels &&
    !(kernel.status === "starting" || kernel.status === "not connected");

  if (!kernelConnected || !channels) {
    return of(
      actions.executeFailed({
        error: new Error("Kernel not connected!"),
        contentRef
      })
    );
  }

  const cellStream = executeCellStream(channels, id, message, contentRef).pipe(
    takeUntil(
      merge(
        action$.pipe(
          ofType(actions.EXECUTE_CANCELED, actions.DELETE_CELL),
          filter(action => action.payload.id === id)
        ),
        action$.pipe(
          ofType(
            actions.LAUNCH_KERNEL,
            actions.LAUNCH_KERNEL_BY_NAME,
            actions.KILL_KERNEL
          ),
          filter(
            (
              action:
                | actions.ExecuteCanceled
                | actions.DeleteCell
                | actions.LaunchKernelAction
                | actions.LaunchKernelByNameAction
                | actions.KillKernelAction
                | actions.SendExecuteRequest
            ) => action.payload.contentRef === contentRef
          )
        )
      )
    )
  );

  return cellStream.pipe(
    startWith(
      /**
       * Clear the existing outputs of the cell to make room for new ones.
       */
      actions.clearOutputs({ id, contentRef }),
      /**
       * Update the cell-status to queued when it is about to be run
       */
      actions.updateCellStatus({ id, status: "queued", contentRef })
    )
  );
}

export function executeAllCellsEpic(
  action$: ActionsObservable<
    actions.ExecuteAllCells | actions.ExecuteAllCellsBelow
  >,
  state$: StateObservable<AppState>
) {
  return action$.pipe(
    ofType(actions.EXECUTE_ALL_CELLS, actions.EXECUTE_ALL_CELLS_BELOW),
    concatMap(
      (action: actions.ExecuteAllCells | actions.ExecuteAllCellsBelow) => {
        const state = state$.value;
        const contentRef = action.payload.contentRef;

        const model = selectors.model(state, { contentRef });
        // If it's not a notebook, we shouldn't be here
        if (!model || model.type !== "notebook") {
          return empty();
        }

        let codeCellIds = List();

        if (action.type === actions.EXECUTE_ALL_CELLS) {
          codeCellIds = selectors.notebook.codeCellIds(model);
        } else if (action.type === actions.EXECUTE_ALL_CELLS_BELOW) {
          codeCellIds = selectors.notebook.codeCellIdsBelow(model);
        }
        return of(
          ...codeCellIds.map((id: CellId) =>
            actions.executeCell({ id, contentRef: action.payload.contentRef })
          )
        );
      }
    )
  );
}

export function executeFocusedCellEpic(
  action$: ActionsObservable<actions.ExecuteFocusedCell>,
  state$: StateObservable<AppState>
) {
  return action$.pipe(
    ofType(actions.EXECUTE_FOCUSED_CELL),
    mergeMap((action: actions.ExecuteFocusedCell) => {
      const contentRef = action.payload.contentRef;
      const state = state$.value;
      const model = selectors.model(state, { contentRef });
      // If it's not a notebook, we shouldn't be here
      if (!model || model.type !== "notebook") {
        return empty();
      }

      const id = model.cellFocused;

      if (!id) {
        throw new Error("attempted to execute without an id");
      }
      return of(
        actions.executeCell({ id, contentRef: action.payload.contentRef })
      );
    })
  );
}

/**
 * Launches the kernel when user tries to execute a cell.
 * The distinct operator prevents the LaunchKernelByName action from
 * being emitted more than once within the same notebook.
 */
export function lazyLaunchKernelEpic(
  action$: ActionsObservable<actions.ExecuteCell>,
  state$: StateObservable<AppState>
) {
  return action$.pipe(
    ofType(actions.EXECUTE_CELL),
    // Be consistent about using state$.value
    withLatestFrom(state$),
    filter(([action, state]) => {
      const contentRef = action.payload.contentRef;
      return !selectors.kernelByContentRef(state, { contentRef });
    }),
    mergeMap(([action, state]) => {
      const contentRef = action.payload.contentRef;
      const content = selectors.content(state, { contentRef });
      const kernelRef = selectors.kernelRefByContentRef(state, {
        contentRef
      });

      if (
        !kernelRef ||
        !content ||
        content.type !== "notebook" ||
        content.model.type !== "notebook"
      ) {
        return of(
          actions.launchKernelFailed({
            error: new Error(
              "Launch kernel failed because the source content is not a notebook"
            ),
            contentRef
          })
        );
      }

      const filepath = content.filepath;
      const notebook = content.model.notebook;
      const { cwd, kernelSpecName } = extractNewKernel(filepath, notebook);

      return of(
        actions.launchKernelByName({
          kernelSpecName,
          cwd,
          kernelRef,
          selectNextKernel: true,
          contentRef
        })
      );
    }),
    distinct(action => action.payload.contentRef)
  );
}

/**
 * Checks if the kernel is ready to excute:
 * - if it is, execute the cell by emitting the SendExecuteRequest action
 * - if it's not, push the execute request to the message queue by emitting
 *    the EnqueueAction action
 */
export function executeCellEpic(
  action$: ActionsObservable<actions.ExecuteCell>,
  state$: StateObservable<AppState>
) {
  return action$.pipe(
    ofType(actions.EXECUTE_CELL),
    withLatestFrom(state$),
    mergeMap(([action, state]) => {
      const contentRef = action.payload.contentRef;
      const kernel = selectors.kernelByContentRef(state, { contentRef });

      if (
        kernel &&
        kernel.channels &&
        kernel.status !== KernelStatus.NotConnected &&
        kernel.status !== KernelStatus.ShuttingDown
      ) {
        return of(actions.sendExecuteRequest(action.payload));
      } else {
        return of(
          actions.updateCellStatus({ ...action.payload, status: "queued" }),
          actions.enqueueAction(action.payload)
        );
      }
    })
  );
}

/**
 * Executes all requests in the message queue then clears the queue after
 * the kernel is launched successfully and is ready to execute.
 */
export function executeCellAfterKernelLaunchEpic(
  action$: ActionsObservable<actions.NewKernelAction>,
  state$: StateObservable<AppState>
) {
  return action$.pipe(
    ofType(actions.LAUNCH_KERNEL_SUCCESSFUL),
    withLatestFrom(state$),
    filter(([action, state]) => {
      if (selectors.messageQueue(state).size === 0) {
        return false;
      }

      const contentRef = action.payload.contentRef;
      const kernel = selectors.kernelByContentRef(state, { contentRef });
      return !!(
        kernel &&
        kernel.channels &&
        kernel.status !== KernelStatus.NotConnected &&
        kernel.status !== KernelStatus.ShuttingDown
      );
    }),
    concatMap(([, state]) => {
      return merge(
        of(
          ...selectors
            .messageQueue(state)
            .map((queuedAction: AnyAction) =>
              actions.executeCell(queuedAction.payload)
            )
        ),
        of(actions.clearMessageQueue())
      );
    })
  );
}

/**
 * the send execute request epic processes execute requests for all cells,
 * creating inner observable streams of the running execution responses
 */
export function sendExecuteRequestEpic(
  action$: ActionsObservable<actions.SendExecuteRequest>,
  state$: StateObservable<AppState>
) {
  return action$.pipe(
    ofType(actions.SEND_EXECUTE_REQUEST),
    tap((action: actions.SendExecuteRequest) => {
      if (!action.payload.id) {
        // Thought: Can create an Error subclass for each error type.
        throw new Error("execute cell needs an id");
      }
    }),
    /**
     * Split the stream by cell IDs create a separate stream for the
     * execution flow of each cell.
     *
     * Note that this can be a memory leak because a new Observable
     * is created for each new cell.
     */
    groupBy((action: actions.SendExecuteRequest) => action.payload.id),
    // Avoid creating a second higher-order Observable by using a mergeMap
    // instead of a map then mergeAll.
    mergeMap(cellAction$ =>
      cellAction$.pipe(
        // When a new SEND_EXECUTE_REQUEST comes in with the current ID, we create a
        // a new stream and unsubscribe from the old one.
        switchMap((action: actions.SendExecuteRequest) => {
          const { id } = action.payload;

          const state = state$.value;

          const contentRef = action.payload.contentRef;
          const model = selectors.model(state, { contentRef });

          // If it's not a notebook, we shouldn't be here
          if (!model || model.type !== "notebook") {
            // TODO: throw an error
            return;
          }

          const cell = selectors.notebook.cellById(model, {
            id
          });
          if (!cell) {
            // TODO: throw an error
            return;
          }

          // Move check for code/markdown cell as guard

          // We only execute code cells
          if ((cell as any).get("cell_type") === "code") {
            // Default to null and add a guard check
            const source = cell.get("source", null);

            const message = createExecuteRequest(source);

            return createExecuteCellStream(
              action$,
              state,
              message,
              id,
              action.payload.contentRef
            ).pipe(
              catchError((error, source) =>
                // TODO: Check if this is a fatal error and decide
                // Investigate startWith for readability
                merge(
                  of(
                    actions.executeFailed({
                      error,
                      contentRef: action.payload.contentRef
                    })
                  ),
                  source
                )
              )
            );
          }
          return empty();
        })
      )
    ),
    // this doesn't recover individual cell streams, just the entire epic
    catchError((error: Error, source) => {
      // Either we ensure that all errors are caught when the action.payload.contentRef
      // is in scope or we make this be a generic ERROR
      return merge(
        of(
          actions.executeFailed({
            error
          })
        ),
        source
      );
    })
  );
}

export const updateDisplayEpic = (
  action$: ActionsObservable<
    actions.NewKernelAction | actions.KillKernelSuccessful
  >
) =>
  // Global message watcher so we need to set up a feed for each new kernel
  action$.pipe(
    ofType(actions.LAUNCH_KERNEL_SUCCESSFUL),
    switchMap(
      (action: actions.NewKernelAction | actions.KillKernelSuccessful) =>
        (action as actions.NewKernelAction).payload.kernel.channels.pipe(
          ofMessageType("update_display_data"),
          map((msg: JupyterMessage) =>
            actions.updateDisplay({
              content: msg.content,
              contentRef: (action as actions.NewKernelAction).payload.contentRef
            })
          ),
          takeUntil(
            action$.pipe(
              ofType(actions.KILL_KERNEL_SUCCESSFUL),
              filter(
                (
                  killAction:
                    | actions.KillKernelSuccessful
                    | actions.NewKernelAction
                ) => killAction.payload.kernelRef === action.payload.kernelRef
              )
            )
          ),
          catchError(error =>
            of(
              actions.updateDisplayFailed({
                error,
                contentRef: (action as actions.NewKernelAction).payload
                  .contentRef
              })
            )
          )
        )
    )
  );

export const sendInputReplyEpic = (
  action$: ActionsObservable<actions.SendInputReply>,
  state$: StateObservable<AppState>
) =>
  action$.pipe(
    ofType(actions.SEND_INPUT_REPLY),
    switchMap((action: actions.SendInputReply) => {
      const state = state$.value;
      const kernel = selectors.kernelByContentRef(state, {
        contentRef: action.payload.contentRef
      });

      if (kernel) {
        const reply = inputReply({ value: action.payload.value });
        kernel.channels.next(reply);
      }

      return empty();
    })
  );
