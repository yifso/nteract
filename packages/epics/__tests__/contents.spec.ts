import FileSaver from "file-saver";
import Immutable from "immutable";
import { ActionsObservable, StateObservable } from "redux-observable";
import { of, Subject } from "rxjs";
import { toArray, map } from "rxjs/operators";

import { stringifyNotebook } from "@nteract/commutable";
import {
  actions,
  ContentRecord,
  createContentRef,
  createKernelspecsRef,
  makeAppRecord,
  makeCommsRecord,
  makeContentsRecord,
  makeDummyContentRecord,
  makeEntitiesRecord,
  makeHostsRecord,
  makeJupyterHostRecord,
  makeNotebookContentRecord,
  makeStateRecord,
  makeTransformsRecord,
  makeLocalHostRecord,
  AppState
} from "@nteract/core";

import { fixtureJSON, mockAppState } from "@nteract/fixtures";
import {
  downloadString,
  saveAsContentEpic,
  saveContentEpic,
  closeNotebookEpic,
  fetchContentEpic,
  updateContentEpic
} from "../src/contents";

jest.mock("rx-jupyter", () => ({
  contents: {
    save: (severConfig, filepath, model) => {
      return of({ response: {} });
    },
    update: (serverConfig, prevFilePath, object) => {
      return of({ status: 200, response: {} });
    },
    get: jest
      .fn()
      .mockReturnValue(
        of({
          status: 200,
          response: { last_modified: "some_stable_value" }
        })
      )
      .mockReturnValueOnce(
        of({
          status: 200,
          response: { last_modified: "one_value" }
        })
      )
      .mockReturnValueOnce(
        of({
          status: 200,
          response: { last_modified: "one_value" }
        })
      )
  }
}));

describe("downloadString", () => {
  it("calls FileSaver.saveAs with notebook and filename", () => {
    const filename = "/here/there/awesome.ipynb";
    const expectedData = fixtureJSON;
    expect(FileSaver.saveAs).not.toHaveBeenCalled();
    downloadString(
      stringifyNotebook(fixtureJSON),
      filename,
      "application/json"
    );
    expect(FileSaver.saveAs).toHaveBeenCalledTimes(1);
    const actualMockBlobResponse = (FileSaver.saveAs as any).mock.calls[0][0];
    const actualFilename = (FileSaver.saveAs as any).mock.calls[0][1];

    expect(actualMockBlobResponse).toEqual({
      content: [stringifyNotebook(expectedData)],
      options: { type: "application/json" }
    });

    expect(actualFilename).toBe("awesome.ipynb");
  });
});

describe("saveAs", () => {
  const contentRef = createContentRef();
  const kernelspecsRef = createKernelspecsRef();
  it("does not save if no host is set", async () => {
    const state = {
      app: makeAppRecord({
        version: "test"
      }),
      comms: makeCommsRecord(),
      config: Immutable.Map({
        theme: "light"
      }),
      core: makeStateRecord({
        currentKernelspecsRef: kernelspecsRef,
        entities: makeEntitiesRecord({
          hosts: makeHostsRecord({}),
          contents: makeContentsRecord({
            byRef: Immutable.Map<string, ContentRecord>().set(
              contentRef,
              makeDummyContentRecord({
                filepath: "test.ipynb"
              })
            )
          }),
          transforms: makeTransformsRecord({
            displayOrder: Immutable.List([]),
            byId: Immutable.Map({})
          })
        })
      })
    };

    const responses = await saveAsContentEpic(
      ActionsObservable.of(
        actions.saveAs({ filepath: "test.ipynb", contentRef })
      ),
      new StateObservable(new Subject(), state)
    )
      .pipe(toArray())
      .toPromise();

    expect(responses).toEqual([
      actions.saveAsFailed({
        contentRef,
        error: new Error("Cannot save content if no host is set.")
      })
    ]);
  });
  it("does not save if there is no content", async () => {
    const state = {
      app: makeAppRecord({
        version: "test",
        host: makeJupyterHostRecord({})
      }),
      comms: makeCommsRecord(),
      config: Immutable.Map({
        theme: "light"
      }),
      core: makeStateRecord({
        currentKernelspecsRef: kernelspecsRef,
        entities: makeEntitiesRecord({
          hosts: makeHostsRecord({}),
          contents: makeContentsRecord({}),
          transforms: makeTransformsRecord({
            displayOrder: Immutable.List([]),
            byId: Immutable.Map({})
          })
        })
      })
    };

    const responses = await saveAsContentEpic(
      ActionsObservable.of(
        actions.saveAs({ filepath: "test.ipynb", contentRef })
      ),
      new StateObservable(new Subject(), state)
    )
      .pipe(toArray())
      .toPromise();

    expect(responses).toEqual([
      actions.saveAsFailed({
        contentRef,
        error: new Error("Content was not set.")
      })
    ]);
  });
  it("saves notebook files", async () => {
    const state = {
      app: makeAppRecord({
        version: "test",
        host: makeJupyterHostRecord({})
      }),
      comms: makeCommsRecord(),
      config: Immutable.Map({
        theme: "light"
      }),
      core: makeStateRecord({
        currentKernelspecsRef: kernelspecsRef,
        entities: makeEntitiesRecord({
          hosts: makeHostsRecord({}),
          contents: makeContentsRecord({
            byRef: Immutable.Map<string, ContentRecord>().set(
              contentRef,
              makeNotebookContentRecord({
                filepath: "a-different-filename.ipynb"
              })
            )
          }),
          transforms: makeTransformsRecord({
            displayOrder: Immutable.List([]),
            byId: Immutable.Map({})
          })
        })
      })
    };

    const responses = await saveAsContentEpic(
      ActionsObservable.of(
        actions.saveAs({ filepath: "test.ipynb", contentRef })
      ),
      new StateObservable(new Subject(), state)
    )
      .pipe(toArray())
      .toPromise();

    expect(responses).toEqual([
      actions.saveAsFulfilled({
        contentRef,
        model: {}
      })
    ]);
  });
});

describe("save", () => {
  const contentRef = createContentRef();
  const kernelspecsRef = createKernelspecsRef();
  it("updates last_modified date from server-side model on save", async () => {
    const state = {
      app: makeAppRecord({
        version: "test",
        host: makeJupyterHostRecord({})
      }),
      comms: makeCommsRecord(),
      config: Immutable.Map({
        theme: "light"
      }),
      core: makeStateRecord({
        currentKernelspecsRef: kernelspecsRef,
        entities: makeEntitiesRecord({
          hosts: makeHostsRecord({}),
          contents: makeContentsRecord({
            byRef: Immutable.Map<string, ContentRecord>().set(
              contentRef,
              makeNotebookContentRecord({
                filepath: "a-different-filename.ipynb"
              })
            )
          }),
          transforms: makeTransformsRecord({
            displayOrder: Immutable.List([]),
            byId: Immutable.Map({})
          })
        })
      })
    };

    const responses = await saveContentEpic(
      ActionsObservable.of(
        actions.save({ filepath: "test.ipynb", contentRef })
      ),
      new StateObservable(new Subject(), state)
    )
      .pipe(toArray())
      .toPromise();

    expect(responses).toEqual([
      actions.saveFulfilled({
        contentRef,
        model: { last_modified: "one_value" }
      }),
      actions.saveFulfilled({
        contentRef,
        model: { last_modified: "some_stable_value" }
      })
    ]);
  });
  it("supports downloading contents of notebook to disk", async () => {
    const state = {
      app: makeAppRecord({
        version: "test",
        host: makeJupyterHostRecord({})
      }),
      comms: makeCommsRecord(),
      config: Immutable.Map({
        theme: "light"
      }),
      core: makeStateRecord({
        currentKernelspecsRef: kernelspecsRef,
        entities: makeEntitiesRecord({
          hosts: makeHostsRecord({}),
          contents: makeContentsRecord({
            byRef: Immutable.Map<string, ContentRecord>().set(
              contentRef,
              makeNotebookContentRecord({
                filepath: "a-different-filename.ipynb"
              })
            )
          }),
          transforms: makeTransformsRecord({
            displayOrder: Immutable.List([]),
            byId: Immutable.Map({})
          })
        })
      })
    };

    const responses = await saveContentEpic(
      ActionsObservable.of(actions.downloadContent({ contentRef })),
      new StateObservable(new Subject(), state)
    )
      .pipe(toArray())
      .toPromise();

    expect(responses).toEqual([
      actions.downloadContentFulfilled({
        contentRef
      })
    ]);
  });
  it("does nothing if requested download is not notebook or file", async () => {
    const state = {
      app: makeAppRecord({
        version: "test",
        host: makeJupyterHostRecord({})
      }),
      comms: makeCommsRecord(),
      config: Immutable.Map({
        theme: "light"
      }),
      core: makeStateRecord({
        currentKernelspecsRef: kernelspecsRef,
        entities: makeEntitiesRecord({
          hosts: makeHostsRecord({}),
          contents: makeContentsRecord({
            byRef: Immutable.Map<string, ContentRecord>().set(
              contentRef,
              makeDummyContentRecord({
                filepath: "a-different-filename.ipynb"
              })
            )
          }),
          transforms: makeTransformsRecord({
            displayOrder: Immutable.List([]),
            byId: Immutable.Map({})
          })
        })
      })
    };

    const responses = await saveContentEpic(
      ActionsObservable.of(actions.downloadContent({ contentRef })),
      new StateObservable(new Subject(), state)
    )
      .pipe(
        map(action => action.type),
        toArray()
      )
      .toPromise();

    expect(responses).toEqual([actions.SAVE_FAILED]);
  });
});

describe("closeNotebookEpic", () => {
  it("can dispatch correct closing actions", done => {
    const state = mockAppState({});
    const contentRef: string = state.core.entities.contents.byRef
      .keySeq()
      .first();
    const action$ = ActionsObservable.of(
      actions.closeNotebook({
        contentRef
      })
    );
    const state$ = new StateObservable<AppState>(new Subject(), state);
    const obs = closeNotebookEpic(action$, state$);
    obs.pipe(toArray()).subscribe(
      action => {
        const types = action.map(({ type }) => type);
        expect(types).toEqual([actions.DISPOSE_CONTENT, actions.KILL_KERNEL]);
      },
      err => done.fail(err), // It should not error in the stream
      () => done()
    );
  });
});

describe("fetchContentEpic", () => {
  it("returns an error if no filepath is provided", done => {
    const state = mockAppState({});
    const contentRef: string = state.core.entities.contents.byRef
      .keySeq()
      .first();
    const action$ = ActionsObservable.of(
      actions.fetchContent({
        contentRef
      })
    );
    const state$ = new StateObservable<AppState>(new Subject(), state);
    const obs = fetchContentEpic(action$, state$);
    obs.pipe(toArray()).subscribe(
      action => {
        expect(action).toEqual([
          actions.fetchContentFailed({
            error: new Error("fetching content needs a payload"),
            filepath: undefined,
            contentRef,
            kernelRef: undefined
          })
        ]);
      },
      err => done.fail(err), // It should not error in the stream
      () => done()
    );
  });
  it("does nothing if target host is not a Jupyter server", done => {
    const state = mockAppState({});
    const contentRef: string = state.core.entities.contents.byRef
      .keySeq()
      .first();
    const action$ = ActionsObservable.of(
      actions.fetchContent({
        contentRef,
        filepath: "my-file.ipynb"
      })
    );
    const state$ = new StateObservable<AppState>(new Subject(), state);
    const obs = fetchContentEpic(action$, state$);
    obs.pipe(toArray()).subscribe(
      action => {
        expect(action).toEqual([]);
      },
      err => done.fail(err), // It should not error in the stream
      () => done()
    );
  });
  it("emits FETCH_CONTENT_FULFILLED action on successful completion", done => {
    const state = {
      ...mockAppState({}),
      app: makeAppRecord({
        host: makeJupyterHostRecord({})
      })
    };
    const contentRef: string = state.core.entities.contents.byRef
      .keySeq()
      .first();
    const action$ = ActionsObservable.of(
      actions.fetchContent({
        contentRef,
        filepath: "my-file.ipynb"
      })
    );
    const state$ = new StateObservable<AppState>(new Subject(), state);
    const obs = fetchContentEpic(action$, state$);
    obs.pipe(toArray()).subscribe(
      action => {
        const types = action.map(({ type }) => type);
        expect(types).toEqual([actions.FETCH_CONTENT_FULFILLED]);
      },
      err => done.fail(err), // It should not error in the stream
      () => done()
    );
  });
});

describe("updateContentEpic", () => {
  it("throws an error if there is no filepath provided", done => {
    const state = mockAppState({});
    const contentRef: string = state.core.entities.contents.byRef
      .keySeq()
      .first();
    const action$ = ActionsObservable.of(
      actions.changeContentName({
        contentRef
      })
    );
    const state$ = new StateObservable<AppState>(new Subject(), state);
    const obs = updateContentEpic(action$, state$);
    obs.pipe(toArray()).subscribe(
      action => {
        const types = action.map(({ type }) => type);
        expect(types).toEqual([actions.CHANGE_CONTENT_NAME_FAILED]);
      },
      err => done.fail(err), // It should not error in the stream
      () => done()
    );
  });
  it("does nothing if the host is not a Jupyter server", done => {
    const state = {
      app: makeAppRecord({
        host: makeLocalHostRecord()
      }),
      ...mockAppState({})
    };
    const contentRef: string = state.core.entities.contents.byRef
      .keySeq()
      .first();
    const action$ = ActionsObservable.of(
      actions.changeContentName({
        contentRef,
        filepath: "test.ipynb"
      })
    );
    const state$ = new StateObservable<AppState>(new Subject(), state);
    const obs = updateContentEpic(action$, state$);
    obs.pipe(toArray()).subscribe(
      action => {
        const types = action.map(({ type }) => type);
        expect(types).toEqual([]);
      },
      err => done.fail(err), // It should not error in the stream
      () => done()
    );
  });
  it("changes the content name on valid details", done => {
    const state = {
      ...mockAppState({}),
      app: makeAppRecord({
        host: makeJupyterHostRecord()
      })
    };
    const contentRef: string = state.core.entities.contents.byRef
      .keySeq()
      .first();
    const action$ = ActionsObservable.of(
      actions.changeContentName({
        contentRef,
        filepath: "test.ipynb"
      })
    );
    const state$ = new StateObservable<AppState>(new Subject(), state);
    const obs = updateContentEpic(action$, state$);
    obs.pipe(toArray()).subscribe(
      action => {
        const types = action.map(({ type }) => type);
        expect(types).toEqual([actions.CHANGE_CONTENT_NAME_FULFILLED]);
      },
      err => {
        console.log(err);
        done.fail(err);
      }, // It should not error in the stream
      () => done()
    );
  });
});
