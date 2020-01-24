import {
  actions,
  makeContentsRecord,
  makeDocumentRecord,
  makeEntitiesRecord,
  makeKernelsRecord,
  makeLocalKernelRecord,
  makeNotebookContentRecord,
  makeStateRecord
} from "@nteract/core";
import { ActionsObservable, StateObservable } from "redux-observable";
import { toArray } from "rxjs/operators";

import { mockAppState } from "@nteract/fixtures";
import Immutable from "immutable";
import { Subject } from "rxjs";
import {
  interruptKernelEpic,
  killKernelEpic
} from "../../../src/notebook/epics/zeromq-kernels";

describe("killKernelEpic", () => {
  it("does nothing if there is no kernelRef", done => {
    const action$ = ActionsObservable.of(actions.killKernel({}));
    const obs = killKernelEpic(action$);
    obs.pipe(toArray()).subscribe(
      action => {
        const types = action.map(({ type }) => type);
        expect(types).toEqual([]);
      },
      err => done.fail(err),
      () => done()
    );
  });
  it("does nothing if there is no kernel", done => {
    const state = mockAppState({});
    const action$ = ActionsObservable.of(
      actions.killKernel({ kernelRef: "not real" })
    );
    const state$ = new StateObservable(new Subject(), state);
    const obs = killKernelEpic(action$, state$);
    obs.pipe(toArray()).subscribe(
      action => {
        const types = action.map(({ type }) => type);
        expect(types).toEqual([]);
      },
      err => done.fail(err),
      () => done()
    );
  });
  it("does nothing if the kernel is not a zeromq kernel", done => {
    const state = mockAppState({});
    const kernelRef = state.core.entities.kernels.byRef.keySeq().first();
    const action$ = ActionsObservable.of(actions.killKernel({ kernelRef }));
    const state$ = new StateObservable(new Subject(), state);
    const obs = killKernelEpic(action$, state$);
    obs.pipe(toArray()).subscribe(
      action => {
        const types = action.map(({ type }) => type);
        expect(types).toEqual([]);
      },
      err => done.fail(err),
      () => done()
    );
  });
});

describe("interruptKernel", () => {
  it("returns an error if there is no kernel to interrupt", done => {
    const action$ = ActionsObservable.of(actions.interruptKernel({}));
    const state$ = new StateObservable(new Subject(), mockAppState({}));
    const obs = interruptKernelEpic(action$, state$);
    obs.pipe(toArray()).subscribe(
      action => {
        const types = action.map(({ type }) => type);
        expect(types).toEqual([actions.INTERRUPT_KERNEL_FAILED]);
      },
      err => done.fail(err),
      () => done()
    );
  });
  it("does nothing if the kernel is not a zeromq kernel", done => {
    const state = mockAppState({});
    const contentRef = state.core.entities.contents.byRef.keySeq().first();
    const action$ = ActionsObservable.of(
      actions.interruptKernel({ contentRef })
    );
    const state$ = new StateObservable(new Subject(), state);
    const obs = interruptKernelEpic(action$, state$);
    obs.pipe(toArray()).subscribe(
      action => {
        const types = action.map(({ type }) => type);
        const error = action.map(({ payload }) => payload.error.message);
        expect(types).toEqual([actions.INTERRUPT_KERNEL_FAILED]);
        expect(error).toEqual(["Invalid kernel type for interrupting"]);
      },
      err => done.fail(err),
      () => done()
    );
  });
  it("calls kill with a SIGINT on the kernel", () => {
    const kill = jest.fn();
    const state = {
      ...mockAppState({}),
      core: makeStateRecord({
        entities: makeEntitiesRecord({
          kernels: makeKernelsRecord({
            byRef: Immutable.Map({
              zeroMQKernel: makeLocalKernelRecord({
                spawn: {
                  kill
                }
              })
            })
          }),
          contents: makeContentsRecord({
            byRef: Immutable.Map({
              content: makeNotebookContentRecord({
                model: makeDocumentRecord({
                  kernelRef: "zeroMQKernel"
                })
              })
            })
          })
        })
      })
    };
    const action$ = ActionsObservable.of(
      actions.interruptKernel({ contentRef: "content" })
    );
    const state$ = new StateObservable(new Subject(), state);
    const obs = interruptKernelEpic(action$, state$);
    obs.pipe(toArray()).subscribe(
      action => {
        const types = action.map(({ type }) => type);
        expect(types).toEqual([actions.INTERRUPT_KERNEL_SUCCESSFUL]);
        expect(kill).toBeCalled();
      },
      err => done.fail(err),
      () => done()
    );
  });
});
