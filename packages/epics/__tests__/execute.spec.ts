import * as actions from "@nteract/actions";
import { createExecuteRequest, createMessage } from "@nteract/messaging";
import * as stateModule from "@nteract/types";
import { ActionsObservable, StateObservable } from "redux-observable";
import { empty, from, Subject } from "rxjs";
import { catchError, share, toArray } from "rxjs/operators";

import {
  createExecuteCellStream,
  executeCellAfterKernelLaunchEpic,
  executeCellEpic,
  executeCellStream,
  lazyLaunchKernelEpic,
  sendExecuteRequestEpic,
  updateDisplayEpic
} from "../src/execute";

const Immutable = require("immutable");

describe("executeCell", () => {
  test("returns an executeCell action", () => {
    expect(
      actions.executeCell({ id: "0-0-0-0", contentRef: "fakeContentRef" })
    ).toEqual({
      type: actions.EXECUTE_CELL,
      payload: { id: "0-0-0-0", contentRef: "fakeContentRef" }
    });
  });
});

describe("executeCellStream", () => {
  test("outright rejects a lack of channels.shell and iopub", done => {
    const obs = executeCellStream(
      null,
      "0",
      createMessage("execute_request"),
      "fakeContentRef"
    );
    obs.subscribe(null, err => {
      expect(err.message).toEqual("kernel not connected");
      done();
    });
  });
});

describe("createExecuteCellStream", () => {
  test("errors if the kernel is not connected in create", done => {
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
                  status: "not connected"
                })
              })
            })
          })
        }),
        app: {
          notificationSystem: { addNotification: jest.fn() }
        }
      }
    };
    const action$ = ActionsObservable.of(
      actions.sendExecuteRequest({
        id: "id",
        message: "test",
        contentRef: "fakeContentRef"
      })
    );
    const observable = createExecuteCellStream(
      action$,
      state$.value,
      createMessage("execute_request"),
      "id",
      "fakeContentRef"
    );
    observable.pipe(toArray()).subscribe(
      actions => {
        const errors = actions.map(({ payload: { error } }) =>
          error.toString()
        );
        expect(errors).toEqual(["Error: Kernel not connected!"]);
        done();
      },
      err => done.fail(err)
    );
  });
  test("doesnt complete but does push until abort action", done => {
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
        app: {
          notificationSystem: { addNotification: jest.fn() }
        }
      }
    };
    const action$ = ActionsObservable.from([]);
    const message = createExecuteRequest("source");

    const observable = createExecuteCellStream(
      action$,
      state$.value,
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
      notificationSystem: { addNotification: jest.fn() },
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
      app: {
        notificationSystem: { addNotification: jest.fn() }
      },
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
    expect(responses).toEqual([]);
  });
});

describe("executeCellAfterKernelLaunchEpic", () => {
  test("executes cell and clears message queue if kernel is ready", done => {
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
      actions.launchKernelSuccessful({
        contentRef: "fakeContentRef",
        kernel: fakeKernel,
        kernelRef: "fakeKernelRef",
        selectNextKernel: false
      })
    );

    const responseActions = [];
    executeCellAfterKernelLaunchEpic(action$, state$).subscribe(
      action => responseActions.push(action),
      err => {
        throw err;
      },
      () => {
        expect(responseActions).toEqual([
          actions.executeCell({
            id: "0",
            contentRef: "fakeContentRef"
          }),
          actions.clearMessageQueue()
        ]);
        done();
      }
    );
  });

  test("do nothing if kernel is still starting", done => {
    const fakeKernel = stateModule.makeRemoteKernelRecord({
      status: "starting"
    });
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
      actions.launchKernelSuccessful({
        contentRef: "fakeContentRef",
        kernel: fakeKernel,
        kernelRef: "fakeKernelRef",
        selectNextKernel: false
      })
    );

    const responseActions = [];
    executeCellAfterKernelLaunchEpic(action$, state$).subscribe(
      action => responseActions.push(action),
      err => {
        throw err;
      },
      () => {
        expect(responseActions).toEqual([]);
        done();
      }
    );
  });
});

describe("lazyLaunchKernelEpic", () => {
  test("emits one launch kernel action for multiple execute cell", async () => {
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
          kernels: stateModule.makeKernelsRecord(),
          messages: stateModule.makeMessagesRecord()
        }),
        kernelRef: "fake"
      })
    };
    const state$ = new StateObservable(new Subject(), state);
    const action$ = ActionsObservable.of(
      actions.executeCell({ id: "0", contentRef: "fakeContentRef" }),
      actions.executeCell({ id: "1", contentRef: "fakeContentRef" }),
      actions.executeCell({ id: "2", contentRef: "fakeContentRef" })
    );
    const responses = await lazyLaunchKernelEpic(action$, state$)
      .pipe(toArray())
      .toPromise();
    expect(responses).toEqual([
      actions.launchKernelByName({
        contentRef: "fakeContentRef",
        cwd: "/",
        kernelRef: "fakeKernelRef",
        kernelSpecName: "python3",
        selectNextKernel: true
      })
    ]);
  });
});

describe("updateDisplayEpic", () => {
  test("handles update_display_data messages", done => {
    const messages = [
      // Should be processed
      {
        header: { msg_type: "update_display_data" },
        content: {
          data: { "text/html": "<marquee>wee</marquee>" },
          transient: { display_id: "1234" }
        }
      },
      {
        header: { msg_type: "display_data" },
        content: {
          data: { "text/html": "<marquee>wee</marquee>" },
          transient: { display_id: "5555" }
        }
      },
      // Should not be processed
      {
        header: { msg_type: "ignored" },
        content: { data: { "text/html": "<marquee>wee</marquee>" } }
      },
      {
        header: { msg_type: "update_display_data" },
        content: {
          data: { "text/plain": "i am text" },
          transient: { display_id: "here" }
        }
      }
    ];

    const channels = from(messages);
    const action$ = ActionsObservable.of({
      type: actions.LAUNCH_KERNEL_SUCCESSFUL,
      payload: {
        kernel: {
          channels,
          cwd: "/home/tester",
          type: "websocket"
        },
        kernelRef: "fakeKernelRef",
        contentRef: "fakeContentRef",
        selectNextKernel: false
      }
    });

    const epic = updateDisplayEpic(action$);

    const responseActions = [];
    epic.subscribe(
      action => responseActions.push(action),
      err => {
        throw err;
      },
      () => {
        expect(responseActions).toEqual([
          actions.updateDisplay({
            content: {
              data: { "text/html": "<marquee>wee</marquee>" },
              transient: { display_id: "1234" }
            },
            contentRef: "fakeContentRef"
          }),
          actions.updateDisplay({
            content: {
              data: { "text/plain": "i am text" },
              transient: { display_id: "here" }
            },
            contentRef: "fakeContentRef"
          })
        ]);
        done();
      }
    );
  });
});
