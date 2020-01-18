import * as actions from "@nteract/actions";
import { makeMessagesRecord } from "@nteract/types";
import Immutable from "immutable";

import { messages } from "../../../src/core/entities/messages";

describe("messages reducers", () => {
  test("can enequeue an action to the messages queue", () => {
    const originalState = makeMessagesRecord();
    const action = actions.enqueueAction({
      id: "cellId",
      contentRef: "contentRef"
    });
    const state = messages(originalState, action);
    expect(state.messageQueue.size).toBe(1);
    expect(state.messageQueue.get(0)).toBe(action);
  });
  test("can clear the message queue", () => {
    const originalState = makeMessagesRecord({
      messageQueue: Immutable.List([
        actions.closeNotebook({ contentRef: "test" })
      ])
    });
    expect(originalState.messageQueue.size).toBe(1);
    const action = actions.clearMessageQueue();
    const state = messages(originalState, action);
    expect(state.messageQueue.size).toBe(0);
  });
});
