import { ActionsObservable, StateObservable } from "redux-observable";

import * as actions from "@nteract/actions";
import {
  Channels,
  ExecuteRequest,
  JupyterMessage,
  MessageType,
  childOf,
  payloads,
  kernelStatuses,
  executionCounts,
  outputs,
  ofMessageType,
  inputRequests
} from "@nteract/messaging";
import { OnDiskOutput } from "@nteract/commutable";
import * as selectors from "@nteract/selectors";
import {
  AppState,
  ContentRef,
  InputRequestMessage,
  PayloadMessage
} from "@nteract/types";

import { Observable, of, Observer } from "rxjs";
import {
  map,
  catchError,
  share,
  mapTo,
  takeUntil,
  merge
} from "rxjs/operators";

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
  const executeRequest = message;

  // All the streams intended for all frontends
  const cellMessages: Observable<JupyterMessage<
    MessageType,
    any
  >> = channels.pipe(childOf(executeRequest), share());

  // All the payload streams, intended for one user
  const payloadStream = cellMessages.pipe(payloads());

  const cellAction$ = merge(
    payloadStream.pipe(
      map((payload: PayloadMessage) =>
        actions.acceptPayloadMessage({ id, payload, contentRef })
      )
    ),

    // All actions for updating cell status
    cellMessages.pipe(
      kernelStatuses() as any,
      map((status: string) =>
        actions.updateCellStatus({ id, status, contentRef })
      )
    ),

    // Update the input numbering: `[ ]`
    cellMessages.pipe(
      executionCounts() as any,
      map((ct: number) =>
        actions.updateCellExecutionCount({ id, value: ct, contentRef })
      )
    ),

    // All actions for new outputs
    cellMessages.pipe(
      outputs() as any,
      map((output: OnDiskOutput) =>
        actions.appendOutput({ id, output, contentRef })
      )
    ),

    // clear_output display message
    cellMessages.pipe(
      ofMessageType("clear_output") as any,
      mapTo(actions.clearOutputs({ id, contentRef }))
    ),

    // Prompt the user for input
    cellMessages.pipe(
      inputRequests() as any,
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

  // On subscription, send the message
  return Observable.create((observer: Observer<any>) => {
    const subscription = cellAction$.subscribe(observer);
    channels.next(executeRequest);
    return subscription;
  });
}

export function createExecuteCellStream(
  action$: ActionsObservable<
    | actions.ExecuteCanceled
    | actions.DeleteCell
    | actions.LaunchKernelAction
    | actions.LaunchKernelByNameAction
    | actions.KillKernelAction
    | actions.ExecuteCell
    | actions.ExecuteFocusedCell
  >,
  state: any,
  message: ExecuteRequest,
  id: string,
  contentRef: ContentRef
): Observable<any> {
  const kernel = selectors.kernelByContentRef(state, {
    contentRef: contentRef
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
          filter(
            (
              action:
                | actions.ExecuteCanceled
                | actions.DeleteCell
                | actions.LaunchKernelAction
                | actions.LaunchKernelByNameAction
                | actions.KillKernelAction
                | actions.ExecuteCell
                | actions.ExecuteFocusedCell
            ) => (action as actions.ExecuteCanceled).payload.id === id
          )
        ),
        action$.pipe(
          ofType(
            actions.LAUNCH_KERNEL,
            actions.LAUNCH_KERNEL_BY_NAME,
            actions.KILL_KERNEL
          )
        )
      )
    )
  );

  return merge(
    /**
     * Clear the existing contents of the cell if it is being re-run
     */
    of(actions.clearOutputs({ id, contentRef })),
    /**
     * Update the cell-status to queued when it is about to be run
     */
    of(actions.updateCellStatus({ id, contentRef, status: "queued" })),
    // Merging it in with the actual stream
    cellStream
  );
}

export const executeSourceEpic = (
  action$: ActionsObservable<actions.SendExecuteRequest>,
  state$: StateObservable<AppState>
) =>
  action$.pipe(
    ofType(actions.SEND_EXECUTE_REQUEST),
    map((action: actions.SendExecuteRequest) => {
      const { message, id, contentRef } = action.payload;
      createExecuteCellStream(
        action$,
        state$.value,
        message,
        id,
        contentRef
      ).pipe(
        catchError((error, source) =>
          merge(
            of(
              actions.executeFailed({
                error,
                contentRef
              })
            ),
            source
          )
        )
      );
    })
  );
