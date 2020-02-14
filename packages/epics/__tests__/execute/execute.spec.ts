import * as actions from "@nteract/actions";
import { createExecuteRequest, createMessage } from "@nteract/messaging";
import * as stateModule from "@nteract/types";
import { ActionsObservable, StateObservable } from "redux-observable";
import { empty, Subject } from "rxjs";
import { catchError, share, toArray } from "rxjs/operators";

import {
  createExecuteCellStream,
  executeCellEpic,
  executeCellStream,
  sendExecuteRequestEpic
} from "../../src/execute";

const Immutable = require("immutable");

describe("executeCellStream", () => {
  test("dispatches actions for updating execution metadata", done => {
    const message = createMessage("execute_request");
    const msg_id = message.header.msg_id;
    const kernelMsgs = [
      {
        parent_header: {
          msg_id
        },
        header: {
          msg_type: "execute_input"
        },
        content: {
          execution_count: 0
        }
      },
      {
        parent_header: {
          msg_id
        },
        header: {
          msg_type: "status"
        },
        content: {
          execution_state: "busy"
        }
      },
      {
        parent_header: {
          msg_id
        },
        header: {
          msg_type: "status"
        },
        content: {
          execution_state: "idle"
        }
      },
      {
        parent_header: {
          msg_id
        },
        header: {
          msg_type: "execute_reply"
        },
        content: {
          execution_count: 0
        }
      }
    ];
    const sent = new Subject();
    const received = new Subject();

    const channels = Subject.create(sent, received);

    sent.subscribe(() => {
      kernelMsgs.map(msg => received.next(msg));
    });

    const obs = executeCellStream(channels, "0", message, "fakeContentRef");

    const emittedActions = [];
    obs.subscribe(action => {
      emittedActions.push(action);
    });

    expect(emittedActions).toContainEqual(
      expect.objectContaining(
        actions.setInCell({
          id: "0",
          contentRef: "fakeContentRef",
          path: ["metadata", "execution", "iopub.execute_input"],
          value: expect.any(String)
        })
      )
    );

    expect(emittedActions).toContainEqual(
      expect.objectContaining(
        actions.setInCell({
          id: "0",
          contentRef: "fakeContentRef",
          path: ["metadata", "execution", "shell.execute_reply"],
          value: expect.any(String)
        })
      )
    );

    expect(emittedActions).toContainEqual(
      expect.objectContaining(
        actions.setInCell({
          id: "0",
          contentRef: "fakeContentRef",
          path: ["metadata", "execution", "iopub.status.idle"],
          value: expect.any(String)
        })
      )
    );

    expect(emittedActions).toContainEqual(
      expect.objectContaining(
        actions.setInCell({
          id: "0",
          contentRef: "fakeContentRef",
          path: ["metadata", "execution", "iopub.status.busy"],
          value: expect.any(String)
        })
      )
    );

    done();
  });
});

describe("createExecuteCellStream", () => {
  test("does not complete but does push until abort action", done => {
    const frontendToShell = new Subject();
    const shellToFrontend = new Subject();
    const mockShell = Subject.create(frontendToShell, shellToFrontend);

    const channels = mockShell;
    const state$ = {
      value: {
        core: stateModule.makeStateRecord({
          kernelRef: "fake",
          entities: stateModule.makeEntitiesRecord({
            kernels: stateModule.makeKernelsRecord({
              byRef: Immutable.Map({
                fake: stateModule.makeRemoteKernelRecord({
                  channels,
                  status: "busy"
                })
              })
            }),
            contents: stateModule.makeContentsRecord({
              byRef: Immutable.Map({
                fakeContentRef: stateModule.makeNotebookContentRecord({
                  model: stateModule.makeDocumentRecord({
                    kernelRef: "fake"
                  })
                })
              })
            })
          })
        }),
        app: {}
      }
    };
    const action$ = ActionsObservable.from([]);
    const message = createExecuteRequest("source");

    const observable = createExecuteCellStream(
      action$,
      channels,
      message,
      "id",
      "fakeContentRef"
    );
    const actionBuffer = [];
    observable.subscribe(
      x => actionBuffer.push(x),
      err => done.fail(err)
    );
    expect(actionBuffer).toEqual([
      actions.clearOutputs({
        id: "id",
        contentRef: "fakeContentRef"
      }),
      actions.updateCellStatus({
        id: "id",
        status: "queued",
        contentRef: "fakeContentRef"
      })
    ]);
    done();
  });
});

describe("executeCellEpic", () => {
  test("Map to SendExecuteRequest action when kernel launched", async () => {
    const fakeKernel = stateModule.makeRemoteKernelRecord({ status: "idle" });
    const fakeContent = stateModule
      .makeNotebookContentRecord()
      .setIn(["model", "kernelRef"], "fakeKernelRef");
    const state = {
      core: stateModule.makeStateRecord({
        entities: stateModule.makeEntitiesRecord({
          contents: stateModule.makeContentsRecord({
            byRef: Immutable.Map({
              fakeContentRef: fakeContent
            })
          }),
          kernels: stateModule.makeKernelsRecord({
            byRef: Immutable.Map({
              fakeKernelRef: fakeKernel
            })
          }),
          messages: stateModule.makeMessagesRecord({
            messageQueue: Immutable.List([
              {
                type: "ENQUEUE_ACTION",
                payload: {
                  contentRef: "fakeContentRef",
                  id: "0"
                }
              }
            ])
          })
        }),
        kernelRef: "fake"
      })
    };
    const state$ = new StateObservable(new Subject(), state);
    const action$ = ActionsObservable.of(
      actions.executeCell({ id: "0", contentRef: "fakeContentRef" })
    );
    const responses = await executeCellEpic(action$, state$)
      .pipe(toArray())
      .toPromise();
    expect(responses).toEqual([
      actions.sendExecuteRequest({ id: "0", contentRef: "fakeContentRef" })
    ]);
  });

  test("Adds action to message queue if kernel is not launched", async () => {
    const fakeContent = stateModule.makeNotebookContentRecord();
    const state = {
      core: stateModule.makeStateRecord({
        entities: stateModule.makeEntitiesRecord({
          contents: stateModule.makeContentsRecord({
            byRef: Immutable.Map({
              fakeContentRef: fakeContent
            })
          }),
          kernels: stateModule.makeKernelsRecord(),
          messages: stateModule.makeMessagesRecord()
        }),
        kernelRef: "fake"
      })
    };
    const state$ = new StateObservable(new Subject(), state);
    const action$ = ActionsObservable.of(
      actions.executeCell({ id: "0", contentRef: "fakeContentRef" })
    );
    const responses = await executeCellEpic(action$, state$)
      .pipe(toArray())
      .toPromise();
    expect(responses).toEqual([
      actions.updateCellStatus({
        id: "0",
        contentRef: "fakeContentRef",
        status: "queued"
      }),
      actions.enqueueAction({ id: "0", contentRef: "fakeContentRef" })
    ]);
  });
});

describe("sendExecuteRequestEpic", () => {
  const state = {
    app: {
      kernel: {
        channels: "errorInExecuteCellObservable",
        status: "idle"
      },
      githubToken: "blah"
    }
  };
  const state$ = new StateObservable(new Subject(), state);

  test("Errors on a bad action", done => {
    // Make one hot action
    const badAction$ = ActionsObservable.of(
      actions.sendExecuteRequest({ id: "id", contentRef: "fakeContentRef" })
    ).pipe(share()) as ActionsObservable<any>;
    const responseActions = sendExecuteRequestEpic(badAction$, state$).pipe(
      catchError(error => {
        expect(error.message).toEqual("execute cell needs an id");
        return empty();
      })
    );
    responseActions.subscribe(
      // Every action that goes through should get stuck on an array
      (x: actions.ExecuteFailed) => {
        expect(x.type).toEqual(actions.EXECUTE_FAILED);
        done();
      },
      err => done.fail(err)
    );
  });

  test("Errors on an action where source not a string", done => {
    const badAction$ = ActionsObservable.of(
      actions.sendExecuteRequest({ id: "id", contentRef: "fakeContentRef" })
    ).pipe(share()) as ActionsObservable<any>;
    const responseActions = sendExecuteRequestEpic(badAction$, state$).pipe(
      catchError(error => {
        expect(error.message).toEqual("execute cell needs source string");
        return empty();
      })
    );
    responseActions.subscribe(
      // Every action that goes through should get stuck on an array
      (x: actions.ExecuteFailed) => {
        expect(x.type).toEqual(actions.EXECUTE_FAILED);
        done();
      },
      err => done.fail(err)
    );
  });

  test("Informs about disconnected kernels, allows reconnection", async () => {
    const disconnectedState = {
      app: {},
      core: stateModule.makeStateRecord({
        kernelRef: "fake",
        entities: stateModule.makeEntitiesRecord({
          contents: stateModule.makeContentsRecord({
            byRef: Immutable.Map({
              fakeContent: stateModule.makeNotebookContentRecord()
            })
          }),
          kernels: stateModule.makeKernelsRecord({
            byRef: Immutable.Map({
              fake: stateModule.makeRemoteKernelRecord({
                channels: null,
                status: "not connected"
              })
            })
          })
        })
      })
    };
    const disconnectedState$ = new StateObservable(
      new Subject(),
      disconnectedState
    );
    const action$ = ActionsObservable.of(
      actions.sendExecuteRequest({ id: "first", contentRef: "fakeContentRef" })
    );
    const responses = await sendExecuteRequestEpic(action$, disconnectedState$)
      .pipe(toArray())
      .toPromise();
    expect(responses.map(response => response.type)).toEqual([
      actions.EXECUTE_FAILED
    ]);
  });
});
