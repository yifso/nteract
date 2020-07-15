import { multiselect } from "../package";

export const selectCell = multiselect.createMyth("selectCell")<{ id: string }>({
  reduce: (state, action) =>
    state.updateIn(["selectedCells"], (list) => list.push(action.payload.id)),
});

export const unselectCell = multiselect.createMyth("unselectCell")<{
  id: string;
}>({
  reduce: (state, action) =>
    state.updateIn(["selectedCells"], (list) => list.remove(action.payload.id)),
});

export const clearSelectedCells = multiselect.createMyth("clearSelectedCells")<
  number
>({
  reduce: (state) => state.updateIn(["selectedCells"], (list) => list.clear()),
});
