import { windowing } from "../package";
import { Window, WindowingBackend, WindowRef } from "../types";


export const setWindowingBackend =
  windowing.createMyth("setWindowingBackend")<WindowingBackend<Window>>({
    reduce: (state, action) =>
      state.set("backend", action.payload),
  });

export const rememberWindow =
  windowing.createMyth("rememberWindow")<{ id: WindowRef; window: Window }>({
    reduce: (state, action) =>
      state.setIn(["windows", action.payload.id], action.payload.window),
  });

export const forgetWindow =
  windowing.createMyth("forgetWindow")<WindowRef>({
    reduce: (state, action) =>
      state.deleteIn(["windows", action.payload]),
  });
