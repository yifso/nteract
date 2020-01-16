import { mount, shallow } from "enzyme";
import Immutable from "immutable";
import React from "react";

import { KeyboardShortcuts } from "../../src/decorators/kbd-shortcuts";

describe("KeyboardShortcuts", () => {
  const map = {};
  beforeEach(() => {
    /**
     * This is to written here to enable testing global key handlers
     * on individual events in React components. For more information,
     * checkout this link.
     *
     * https://github.com/airbnb/enzyme/issues/426#issuecomment-228601631
     */
    document.addEventListener = jest.fn((event, cb) => {
      map[event] = cb;
    });
  });
  it("renders without crashing", () => {
    const component = shallow(
      <KeyboardShortcuts contentRef={"test"}>
        <p>test</p>
      </KeyboardShortcuts>
    );
    expect(component).not.toBeNull();
  });
  it("does nothing if enter is not pressed", () => {
    const executeFocusedCell = jest.fn();
    const component = shallow(
      <KeyboardShortcuts
        contentRef={"test"}
        executeFocusedCell={executeFocusedCell}
      >
        <p>test</p>
      </KeyboardShortcuts>
    );
    expect(component).not.toBeNull();
    map.keydown({ key: "Not Enter" });

    expect(executeFocusedCell).not.toBeCalled();
  });
  it("does nothing if a meta key is not pressed", () => {
    const executeFocusedCell = jest.fn();
    const component = shallow(
      <KeyboardShortcuts
        contentRef={"test"}
        executeFocusedCell={executeFocusedCell}
      >
        <p>test</p>
      </KeyboardShortcuts>
    );
    expect(component).not.toBeNull();
    map.keydown({ key: "Enter", ctrlKey: false });
    expect(executeFocusedCell).not.toBeCalled();
  });
  it("executes focused cell if the correct key combination is pressed", () => {
    const executeFocusedCell = jest.fn();
    const focusNextCell = jest.fn();
    const focusNextCellEditor = jest.fn();

    const component = mount(
      <KeyboardShortcuts
        contentRef={"test"}
        executeFocusedCell={executeFocusedCell}
        focusNextCell={focusNextCell}
        focusNextCellEditor={focusNextCellEditor}
        focusedCell={"cellId"}
        cellOrder={Immutable.List(["cellId", "cellId1"])}
        cellMap={Immutable.Map({
          cellId: Immutable.Map({ cell_type: "code" }),
          cellId1: Immutable.Map({ cell_type: "code" })
        })}
      >
        <p>test</p>
      </KeyboardShortcuts>
    );
    expect(component).not.toBeNull();
    map.keydown({
      key: "Enter",
      ctrlKey: false,
      metaKey: true,
      shiftKey: true,
      preventDefault: () => {}
    });
    // Should execute the currently focused cell
    expect(executeFocusedCell).toBeCalled();
    // Should focus the next cell
    expect(focusNextCell).toBeCalled();
    // Should focus the next cell editor since it is a code cell
    expect(focusNextCellEditor).toBeCalled();
  });
  it("should not focus next cell's editor if it is markdown", () => {
    const executeFocusedCell = jest.fn();
    const focusNextCell = jest.fn();
    const focusNextCellEditor = jest.fn();

    const component = mount(
      <KeyboardShortcuts
        contentRef={"test"}
        executeFocusedCell={executeFocusedCell}
        focusNextCell={focusNextCell}
        focusNextCellEditor={focusNextCellEditor}
        focusedCell={"cellId"}
        cellOrder={Immutable.List(["cellId", "cellId1"])}
        cellMap={Immutable.Map({
          cellId: Immutable.Map({ cell_type: "code" }),
          cellId1: Immutable.Map({ cell_type: "markdown" })
        })}
      >
        <p>test</p>
      </KeyboardShortcuts>
    );
    expect(component).not.toBeNull();
    map.keydown({
      key: "Enter",
      ctrlKey: false,
      metaKey: true,
      shiftKey: true,
      preventDefault: () => {}
    });
    // Should execute the currently focused cell
    expect(executeFocusedCell).toBeCalled();
    // Should focus the next cell
    expect(focusNextCell).toBeCalled();
    // Should focus the next cell editor since it is a code cell
    expect(focusNextCellEditor).not.toBeCalled();
  });
});
