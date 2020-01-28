import { Map } from "immutable";

import * as actions from "../../src/main/actions";
import reducers from "../../src/main/reducers";

describe("setKernelspecs", () => {
  test("sets kernelspecs in the state", () => {
    const initialState = Map({ kernelSpecs: null });

    const state = reducers(initialState, {
      type: "SET_KERNELSPECS",
      payload: {
        kernelSpecs: {
          python3: {
            files: [
              "/usr/local/share/jupyter/kernels/python3/kernel.json",
              "/usr/local/share/jupyter/kernels/python3/logo-32x32.png",
              "/usr/local/share/jupyter/kernels/python3/logo-64x64.png"
            ],
            resource_dir: "/usr/local/share/jupyter/kernels/python3",
            spec: {
              language: "python",
              display_name: "Python 3",
              argv: [Object]
            }
          },
          javascript: {
            files: [
              "/Users/rgbkrk/Library/Jupyter/kernels/javascript/kernel.json",
              "/Users/rgbkrk/Library/Jupyter/kernels/javascript/logo-32x32.png",
              "/Users/rgbkrk/Library/Jupyter/kernels/javascript/logo-64x64.png"
            ],
            resource_dir: "/Users/rgbkrk/Library/Jupyter/kernels/javascript",
            spec: {
              argv: [Object],
              display_name: "Javascript (Node.js)",
              language: "javascript"
            }
          }
        }
      }
    });
    expect(state.get("kernelSpecs")).not.toBeNull();
  });
});

describe("setQuittingState", () => {
  it("updates quitting state for app", () => {
    const originalState = Map({});
    const action = actions.setQuittingState(actions.QUITTING_STATE_QUITTING);
    const state = reducers(originalState, action);
    expect(state.get("quittingState")).toBe(actions.QUITTING_STATE_QUITTING);
  });
});

describe("reducer", () => {
  it("does not modify state on out-of-scope action", () => {
    const originalState = Map({});
    const action = { type: "A_DIFFERENT_ONE" };
    const state = reducers(originalState, action);
    expect(state).toEqual(originalState);
  });
});
