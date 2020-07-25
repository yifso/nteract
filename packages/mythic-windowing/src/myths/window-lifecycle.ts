import { windowing } from "../package";
import { WindowProps } from "../types";


export const showWindow =
  windowing.createMyth("showWindow")<WindowProps>({
    thenDispatch: [
      (action, state) =>
        state.backend.showWindow(action.payload),
    ],
  });

export const closeWindow =
  windowing.createMyth("closeWindow")<string>({
    thenDispatch: [
      (action, state) =>
        state.backend.closeWindow(
          action.payload,
          state.windows.get(action.payload),
        ),
    ],
  });
