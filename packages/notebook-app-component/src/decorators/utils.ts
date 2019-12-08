import { selectors } from "@nteract/core";
import { AppState, ContentRef } from "@nteract/types";

export interface CellAddress {
  id: string;
  contentRef: ContentRef;
}

export const cellAddress = ({ id, contentRef }: CellAddress) => (
  { id, contentRef }
);

export const cellFromState = (
  state: AppState,
  { id, contentRef }: CellAddress,
) => {
  const model = selectors.model(state, { contentRef });
  if (!model || model.type !== "notebook") {
    throw new Error("non-notebook model");
  }

  const cell = selectors.notebook.cellById(model, { id });
  if (!cell) {
    throw new Error("cell not found inside cell map");
  }

  return cell;
};
