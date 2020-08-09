import { windowing } from "../package";
import { Window, WindowingBackend } from "../types";


export const setWindowingBackend =
  windowing.createMyth("setWindowingBackend")<WindowingBackend<Window>>({
    reduce: (state, action) =>
      state.set("backend", action.payload),
  });

export const registerWindow =
  windowing.createMyth("registerWindow")<{ id: string; window: Window }>({
    reduce: (state, action) =>
      state.setIn(["windows", action.payload.id], action.payload.window),
  });

export const deregisterWindow =
  windowing.createMyth("deregisterWindow")<string>({
    reduce: (state, action) =>
      state.deleteIn(["windows", action.payload]),
  });
