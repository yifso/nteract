import { monocellNotebook, toJS } from "@nteract/commutable";
import { actions } from "@nteract/core";
import { fixtureCommutable, mockAppState } from "@nteract/fixtures";
import { ActionsObservable, StateObservable } from "redux-observable";
import { Subject } from "rxjs";
import { toArray } from "rxjs/operators";

import {
  createContentsResponse,
  extractNewKernel,
  fetchContentEpic,
  launchKernelWhenNotebookSetEpic,
  newNotebookEpic
} from "../../../src/notebook/epics/loading";

const path = require("path");

describe("extractNewKernel", () => {
  test("extracts and launches the kernel from a notebook", () => {
    expect(extractNewKernel("/tmp/test.ipynb", fixtureCommutable)).toEqual({
      kernelSpecName: "python3",
      cwd: path.resolve("/tmp")
    });
  });
});

describe("loadingEpic", () => {
  test("errors without a filename", done => {
    const action$ = ActionsObservable.of({
      type: "CORE/FETCH_CONTENT",
      payload: {}
    });
    const responseActions = fetchContentEpic(action$);
    responseActions.subscribe(
      _ => _,
      err => {
        expect(err.message).toBe("fetch content needs a path");
        done();
      },
      () => {
        done.fail();
      }
    );
  });
  test("errors when file cant be read", async () => {
    const action$ = ActionsObservable.of({
      type: "CORE/FETCH_CONTENT",
      payload: { filepath: "file" }
    });

    const responseActions = await fetchContentEpic(action$)
      .pipe(toArray())
      .toPromise();

    expect(responseActions).toEqual([
      {
        payload: {
          error: expect.anything(),
          filepath: "file"
        },
        error: true,
        type: "CORE/FETCH_CONTENT_FAILED"
      }
    ]);
  });
});

describe("newNotebookEpic", () => {
  test("calls new Kernel after creating a new notebook", async () => {
    const action$ = ActionsObservable.of({
      type: actions.NEW_NOTEBOOK,
      payload: {
        filepath: null,
        cwd: "/home/whatever",
        kernelSpec: {
          name: "hylang"
        },
        kernelRef: "kRef",
        contentRef: "cRef"
      }
    });
    const responseActions = await newNotebookEpic(action$)
      .pipe(toArray())
      .toPromise();
    const filepath =
      process.platform === "win32"
        ? "\\home\\whatever\\Untitled.ipynb"
        : "/home/whatever/Untitled.ipynb";

    expect(responseActions).toEqual([
      {
        type: actions.FETCH_CONTENT_FULFILLED,
        payload: {
          contentRef: "cRef",
          kernelRef: "kRef",
          filepath,
          model: {
            type: "notebook",
            mimetype: "application/x-ipynb+json",
            format: "json",
            content: toJS(
              monocellNotebook
                .setIn(["metadata", "kernel_info", "name"], "hylang")
                .setIn(["metadata", "language_info", "name"], "hylang")
            ),
            writable: true,
            name: "Untitled.ipynb",
            path: filepath,
            created: expect.any(String),
            last_modified: expect.any(String)
          }
        }
      }
    ]);
  });
});

describe("newNotebookEpicNamed", () => {
  test("calls new Kernel after creating a new notebook with given name", async () => {
    const action$ = ActionsObservable.of({
      type: actions.NEW_NOTEBOOK,
      payload: {
        filepath: "/home/whatever2/some.ipynb",
        cwd: "/home/whatever",
        kernelSpec: {
          name: "hylang"
        },
        kernelRef: "kRef",
        contentRef: "cRef"
      }
    });
    const responseActions = await newNotebookEpic(action$)
      .pipe(toArray())
      .toPromise();
    const filepath =
      process.platform === "win32"
        ? "\\home\\whatever2\\some.ipynb"
        : "/home/whatever2/some.ipynb";

    expect(responseActions).toEqual([
      {
        type: actions.FETCH_CONTENT_FULFILLED,
        payload: {
          contentRef: "cRef",
          kernelRef: "kRef",
          filepath,
          model: {
            type: "notebook",
            mimetype: "application/x-ipynb+json",
            format: "json",
            content: toJS(
              monocellNotebook
                .setIn(["metadata", "kernel_info", "name"], "hylang")
                .setIn(["metadata", "language_info", "name"], "hylang")
            ),
            writable: true,
            name: "some.ipynb",
            path: filepath,
            created: expect.any(String),
            last_modified: expect.any(String)
          }
        }
      }
    ]);
  });
});

describe("createContentsResponse", () => {
  it("throws an error if content is directory", () => {
    const filePath = "/test-directory";
    const stats = {
      isDirectory: () => true,
      birthtime: new Date(),
      mtime: new Date()
    };
    const content = new Buffer("test");
    const invocation = () => createContentsResponse(filePath, stats, content);
    expect(invocation).toThrowError(
      "Attempted to open a directory instead of a notebook"
    );
  });
  it("throws an error for non-ipynb files", () => {
    const filePath = "/test-directory/test.txt";
    const stats = {
      isDirectory: () => false,
      isFile: () => true,
      birthtime: new Date(),
      mtime: new Date()
    };
    const content = new Buffer("test");
    const invocation = () => createContentsResponse(filePath, stats, content);
    expect(invocation).toThrowError(
      "File does not end in ipynb and will not be opened"
    );
  });
  it("handles ipynb files", () => {
    const filePath = "/test-directory/test.ipynb";
    const stats = {
      isDirectory: () => false,
      isFile: () => true,
      birthtime: new Date(),
      mtime: new Date()
    };
    const content = new Buffer("{  }");
    const result = createContentsResponse(filePath, stats, content);
    expect(result).toBeDefined();
    expect(result.writable).toBe(false);
  });
});

describe("launchKernelWhenNotebookSetEpic", () => {
  it("does nothing for non-notebook files", done => {
    const state = mockAppState({});
    const action$ = ActionsObservable.of(
      actions.fetchContentFulfilled({ contentRef: "test" })
    );
    const state$ = new StateObservable(new Subject(), state);
    const obs = launchKernelWhenNotebookSetEpic(action$, state$);
    obs.pipe(toArray()).subscribe(
      action => {
        const types = action.map(({ type }) => type);
        expect(types).toEqual([]);
      },
      err => done.fail(err),
      () => done()
    );
  });
  it("launches a kernel for a given content", done => {
    const state = mockAppState({});
    const contentRef = state.core.entities.contents.byRef.keySeq().first();
    const action$ = ActionsObservable.of(
      actions.fetchContentFulfilled({ contentRef })
    );
    const state$ = new StateObservable(new Subject(), state);
    const obs = launchKernelWhenNotebookSetEpic(action$, state$);
    obs.pipe(toArray()).subscribe(
      action => {
        const types = action.map(({ type }) => type);
        expect(types).toEqual([actions.LAUNCH_KERNEL_BY_NAME]);
      },
      err => done.fail(err),
      () => done()
    );
  });
});
