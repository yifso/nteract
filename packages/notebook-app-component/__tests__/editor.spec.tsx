import React from "react";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import { fixtureStore } from "@nteract/fixtures";
import { actions } from "@nteract/core";

import Editor from "../src/editor";

describe("EditorProvider", () => {
  const store = fixtureStore({});

  const state = store.getState();
  const contentRef = state.core.entities.contents.byRef.keySeq().first();

  const content = state.core.entities.contents.byRef.get(contentRef);
  if (!content) {
    throw new Error("Content not set up properly for test");
  }

  console.log(contentRef);

  const setup = (id, cellFocused = true) =>
    mount(
      <Provider store={store}>
        <Editor
          contentRef={contentRef}
          id={id}
          focusAbove={jest.fn()}
          focusBelow={jest.fn()}
        />
      </Provider>
    );

  test("can be constructed", () => {
    const component = setup("test");
    expect(component).not.toBeNull();
  });
  test("onChange updates cell source", () =>
    new Promise(resolve => {
      const dispatch = action => {
        expect(action.payload.id).toBe("test");
        expect(action.payload.value).toBe("i love nteract");
        expect(action.type).toBe(actions.SET_IN_CELL);
        resolve();
      };
      store.dispatch = dispatch as any;
      const wrapper = setup("test");
      const onChange = wrapper
        .findWhere(n => n.prop("onChange") !== undefined)
        .first()
        .prop("onChange");
      onChange("i love nteract");
    }));
  test("onFocusChange can update editor focus", () =>
    new Promise(resolve => {
      const dispatch = action => {
        expect(action.payload.id).toBe("test");
        expect(action.type).toBe(actions.FOCUS_CELL_EDITOR);
        resolve();
      };
      store.dispatch = dispatch;
      const wrapper = setup("test");
      const onFocusChange = wrapper
        .findWhere(n => n.prop("onFocusChange") !== undefined)
        .first()
        .prop("onFocusChange");
      onFocusChange(true);
    }));
});
