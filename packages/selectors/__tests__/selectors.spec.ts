import Immutable from "immutable";

import { dummyCommutable } from "@nteract/core/dummy";
import * as selectors from "../src";

import { makeDocumentRecord } from "@nteract/core";

describe("codeMirrorMode", () => {
  test("determines the right mode from the notebook metadata", () => {
    const mode = selectors.notebook.codeMirrorMode(
        makeDocumentRecord({
        notebook: dummyCommutable
      })
    );
    expect(mode).toEqual(Immutable.fromJS({ name: "ipython", version: 3 }));

    const lang2 = selectors.notebook.codeMirrorMode(
      makeDocumentRecord({
        notebook: dummyCommutable.setIn(
          ["metadata", "language_info", "codemirror_mode", "name"],
          "r"
        )
      })
    );
    expect(lang2).toEqual(Immutable.fromJS({ name: "r", version: 3 }));
  });
});