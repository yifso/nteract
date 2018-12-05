import actions from "@nteract/actions";

import { makeKernelsRecord } from "@nteract/types";
import { kernels } from "../../../src/core/entities/kernels";

describe("LAUNCH_KERNEL reducers", () => {
  test("set launching state", () => {
    const originalState = makeKernelsRecord();
    const action = actions.launchKernel({
      kernelSpec: "kernelSpec",
      cwd: ".",
      kernelRef: "kernelRef",
      selectNextKernel: false,
      contentRef: "contentRef"
    });
    const state = kernels(originalState, action);
    expect(state.byRef.get("kernelRef").type).toBe("unknown");
    expect(state.byRef.get("kernelRef").status).toBe("launching");
  });
});
