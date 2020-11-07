import { windowing } from "../package";
import { WindowProps, WindowRef } from "../types";


export const showWindow =
  windowing.createMyth("showWindow")<WindowProps>({
    thenDispatch: [
      (action, state) =>
        state.backend.showWindow(action.payload),
    ],
  });

export const closeWindow =
  windowing.createMyth("closeWindow")<WindowRef>({
    thenDispatch: [
      (action, state) =>
        state.backend.closeWindow(
          action.payload,
          state.windows.get(action.payload),
        ),
    ],
  });
