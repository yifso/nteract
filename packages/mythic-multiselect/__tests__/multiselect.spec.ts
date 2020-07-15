import {
  selectCell,
  unselectCell,
  clearSelectedCells,
  multiselect,
} from "@nteract/mythic-multiselect";

describe("multiselect", () => {
  test("emits a notification when sendNotification is reduced", () => {
    const originalState = multiselect.makeStateRecord({
      current: {
        addNotification: jest.fn(),
      },
    });

    const state = multiselect.rootReducer(
      originalState,
      selectCell.create({
        title: "add me add me add me",
        message: "you just gotta addNotification() me",
        level: "info",
      })
    );

    expect(state).toEqual(originalState);
    expect(state.current.addNotification).toBeCalledTimes(1);
  });
});
