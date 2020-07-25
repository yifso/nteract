import { windowing } from "../package";


export const registerWindow = <T>() =>
  windowing.createMyth("registerWindow")<{ id: string; window: T }>({
    reduce: (state, action) =>
      state.setIn(["windows", action.payload.id], action.payload.window),
  });

export const deregisterWindow =
  windowing.createMyth("deregisterWindow")<string>({
    reduce: (state, action) =>
      state.deleteIn(["windows", action.payload]),
  });
