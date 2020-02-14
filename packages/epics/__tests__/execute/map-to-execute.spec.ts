import * as actions from "@nteract/actions";
import { mockAppState } from "@nteract/fixtures";
import { ActionsObservable, StateObservable } from "redux-observable";
import { Subject } from "rxjs";
import { toArray } from "rxjs/operators";

import { executeAllCellsEpic } from "../../src/execute";

const Immutable = require("immutable");

describe("executeAllCellsEpic", () => {
  test("returns an error action if no content given", done => {
    const state = mockAppState({});
    const action$ = ActionsObservable.of(
      actions.executeAllCells({ contentRef: "noContentForMe" })
    );
    const state$ = new StateObservable(new Subject(), state);
    const obs = executeAllCellsEpic(action$, state$);
    obs.pipe(toArray()).subscribe(
      action => {
        const types = action.map(({ type }) => type);
        expect(types).toEqual([actions.EXECUTE_FAILED]);
      },
      err => done.fail(err), // It should not error in the stream
      () => done()
    );
  });
  test("does nothing if the model is not a notebook", done => {
    const state = mockAppState({ codeCellCount: 2 });
    const contentRef = state.core.entities.contents.byRef.keySeq().first();
    const action$ = ActionsObservable.of(
      actions.executeAllCells({ contentRef })
    );
    const state$ = new StateObservable(new Subject(), state);
    const obs = executeAllCellsEpic(action$, state$);
    obs.pipe(toArray()).subscribe(
      action => {
        const types = action.map(({ type }) => type);
        expect(types).toEqual([actions.EXECUTE_CELL, actions.EXECUTE_CELL]);
      },
      err => done.fail(err), // It should not error in the stream
      () => done()
    );
  });
});

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
