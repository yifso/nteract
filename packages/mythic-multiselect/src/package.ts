import { createMythicPackage } from "@nteract/myths";
import { CellId } from "@nteract/commutable";

export const multiselect = createMythicPackage("multiselect")<{
  selectedCells: CellId[];
}>({
  initialState: {
    selectedCells: []
  }
});
