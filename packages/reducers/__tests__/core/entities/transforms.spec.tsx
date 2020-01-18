import * as actions from "@nteract/actions";
import { makeTransformsRecord } from "@nteract/types";
import Immutable from "immutable";

import { transforms } from "../../../src/core/entities/transforms";

describe("transforms reducers", () => {
  test("ADD_TRANSFORM adds an nteract transform the list of transforms", () => {
    const originalState = makeTransformsRecord();
    const action = actions.addTransform({
      mediaType: "application/json",
      component: data => <div>{data}</div>
    });
    const state = transforms(originalState, action);
    expect(state.displayOrder.size).toBe(1);
    expect(state.byId.get("application/json")).toBeTruthy();
  });
  test("REMOVE_TRANSFORM removes a transform by its media type", () => {
    const originalState = makeTransformsRecord({
      displayOrder: Immutable.List(["application/json"]),
      byId: Immutable.Map({
        "application/json": data => <div>{data}</div>
      })
    });
    expect(originalState.displayOrder.size).toBe(1);
    expect(originalState.byId.get("application/json")).toBeTruthy();
    const action = actions.removeTransform({
      mediaType: "application/json"
    });
    const state = transforms(originalState, action);
    expect(state.displayOrder.size).toBe(0);
    expect(state.byId.get("application/json")).toBeUndefined();
  });
});
