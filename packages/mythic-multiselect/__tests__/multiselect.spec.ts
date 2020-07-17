import {
  selectCell,
  unselectCell,
  multiselect,
} from "@nteract/mythic-multiselect";
import { List } from "immutable";

describe("multiselect", () => {
  test("selects a cell", () => {
    const originalState = multiselect.makeStateRecord({
      selectedCells: List(),
    });

    const state = multiselect.rootReducer(
      originalState,
      selectCell.create({
        id: "test",
      })
    );

    expect(originalState.selectedCells.size).toBeLessThan(
      state.selectedCells.size
    );

    const nextState = multiselect.rootReducer(
      state,
      unselectCell.create({
        id: "test2",
      })
    );

    expect(nextState.selectedCells.size).toBeLessThan(state.selectedCells.size);
  });
});
