export type QuittingState =
  | "Not Started" // Not currently orchestrating a quit
  | "Quitting"; // In the process of closing notebooks in preparation to quit
export const QUITTING_STATE_NOT_STARTED: QuittingState = "Not Started";
export const QUITTING_STATE_QUITTING: QuittingState = "Quitting";

export interface SetQuittingStateAction {
  type: "SET_QUITTING_STATE";
  payload: {
    newState: QuittingState;
  };
}

export function setQuittingState(
  newState: QuittingState
): SetQuittingStateAction {
  return {
    type: "SET_QUITTING_STATE",
    payload: {
      newState
    }
  };
}
