import { emptyMarkdownCell } from "@nteract/commutable";
import { mount, shallow } from "enzyme";
import React from "react";

import DraggableCell, {
  DraggableCellView,
  isDragUpper
} from "../../src/decorators/draggable";

// Spoof DND manager for tests.
const dragDropManager = {
  getMonitor: () => ({
    subscribeToStateChange: () => {},
    isDraggingSource: () => {}
  }),
  getBackend: () => {},
  getRegistry: () => ({
    addSource: () => {},
    removeSource: () => {}
  })
};

describe("DraggableCell", () => {
  test("can be rendered", () => {
    const cell = shallow(<DraggableCell cell={emptyMarkdownCell} />, {
      context: { dragDropManager }
    });
    expect(cell).not.toBeNull();
  });
});

describe("DraggableCellView", () => {
  test("can be rendered", () => {
    const connectDragPreview = jest.fn(el => el);
    const connectDragSource = jest.fn(el => el);
    const connectDropTarget = jest.fn(el => el);
    const focusCell = jest.fn();
    const moveCell = jest.fn();
    const cell = mount(
      <DraggableCellView
        connectDragPreview={connectDragPreview}
        connectDragSource={connectDragSource}
        isDragging={false}
        isOver={false}
        connectDropTarget={connectDropTarget}
        focusCell={focusCell}
        moveCell={moveCell}
        id="cellId"
        contentRef="contentRef"
      >
        <p>Children</p>
      </DraggableCellView>
    );
    expect(cell).not.toBeNull();
  });
});

describe("isDragUpper", () => {
  it("returns true if the object is dragged upward", () => {
    const el = {
      getBoundingClientRect: jest.fn(() => ({
        bottom: 20,
        top: 2
      }))
    };
    const monitor = {
      getClientOffset: jest.fn(() => ({
        top: 1,
        y: 2
      }))
    };
    const result = isDragUpper({}, monitor, el);
    expect(result).toBe(true);
  });
  it("returns false if the object is dragged upward", () => {
    const el = {
      getBoundingClientRect: jest.fn(() => ({
        bottom: 3,
        top: 1
      }))
    };
    const monitor = {
      getClientOffset: jest.fn(() => ({
        top: 1,
        y: 10
      }))
    };
    const result = isDragUpper({}, monitor, el);
    expect(result).toBe(false);
  });
});
