import Immutable from "immutable";

import { fixtureCommutable, mockAppState } from "@nteract/fixtures";
import * as selectors from "../src";

import { makeDocumentRecord } from "@nteract/core";

describe("codeMirrorMode", () => {
  test("determines the right mode from the notebook metadata", () => {
    const mode = selectors.notebook.codeMirrorMode(
      makeDocumentRecord({
        notebook: fixtureCommutable
      })
    );
    expect(mode).toEqual(Immutable.fromJS({ name: "ipython", version: 3 }));

    const lang2 = selectors.notebook.codeMirrorMode(
      makeDocumentRecord({
        notebook: fixtureCommutable.setIn(
          ["metadata", "language_info", "codemirror_mode", "name"],
          "r"
        )
      })
    );
    expect(lang2).toEqual(Immutable.fromJS({ name: "r", version: 3 }));
  });
});

describe("contentRefByFilepath", () => {
  test("returns undefined if filepath is not loaded", () => {
    const state = mockAppState();
    expect(
      selectors.contentRefByFilepath(state, {
        filepath: "not-a-real-path.ipynb"
      })
    ).toBeUndefined();
  });
  test("returns the correct content ref for a filepath", () => {
    const state = mockAppState();
    expect(
      selectors.contentRefByFilepath(state, {
        filepath: "dummy-store-nb.ipynb"
      })
    ).toBeDefined();
  });
});
