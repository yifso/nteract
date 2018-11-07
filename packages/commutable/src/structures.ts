import uuid from "uuid/v4";

import {
  makeNotebookRecord,
  ImmutableNotebook,
  ImmutableCellOrder,
  ImmutableCellMap
} from "./types";

import { makeCodeCell, makeMarkdownCell, ImmutableCell } from "./cells";

// The cell creators here are a bit duplicative
export const createCodeCell = makeCodeCell;
export const createMarkdownCell = makeMarkdownCell;

export const emptyCodeCell = createCodeCell();
export const emptyMarkdownCell = createMarkdownCell();

// These are all kind of duplicative now that we're on records
// Since we export these though, they're left for
// backwards compatiblity
export const defaultNotebook = makeNotebookRecord();
export const createNotebook = makeNotebookRecord;
export const emptyNotebook = makeNotebookRecord();

export type CellStructure = {
  cellOrder: ImmutableCellOrder;
  cellMap: ImmutableCellMap;
};

// Intended to make it easy to use this with (temporary mutable cellOrder +
// cellMap)
export const appendCell = (
  cellStructure: CellStructure,
  immutableCell: ImmutableCell,
  id: string = uuid()
): CellStructure => ({
  cellOrder: cellStructure.cellOrder.push(id),
  cellMap: cellStructure.cellMap.set(id, immutableCell)
});

export const appendCellToNotebook = (
  immnb: ImmutableNotebook,
  immCell: ImmutableCell
): ImmutableNotebook =>
  immnb.withMutations(nb => {
    const cellStructure: CellStructure = {
      cellOrder: nb.get("cellOrder"),
      cellMap: nb.get("cellMap")
    };
    const { cellOrder, cellMap } = appendCell(cellStructure, immCell);
    return nb.set("cellOrder", cellOrder).set("cellMap", cellMap);
  });

export const insertCellAt = (
  notebook: ImmutableNotebook,
  cell: ImmutableCell,
  cellID: string,
  index: number
): ImmutableNotebook =>
  notebook.withMutations(nb =>
    nb
      .setIn(["cellMap", cellID], cell)
      // $FlowFixMe: Fixed by making ImmutableNotebook a typed record.
      .set("cellOrder", nb.get("cellOrder").insert(index, cellID))
  );

export const insertCellAfter = (
  notebook: ImmutableNotebook,
  cell: ImmutableCell,
  cellID: string,
  priorCellID: string
): ImmutableNotebook =>
  insertCellAt(
    notebook,
    cell,
    cellID,
    // $FlowFixMe: Fixed by making ImmutableNotebook a typed record.
    notebook.get("cellOrder").indexOf(priorCellID) + 1
  );

/**
 * @deprecated use `deleteCell()` instead
 */
export const removeCell = (
  notebook: ImmutableNotebook,
  cellID: string
): ImmutableNotebook => {
  console.log(
    "Deprecation Warning: removeCell() is being deprecated. Please use deleteCell() instead"
  );
  return notebook
    .removeIn(["cellMap", cellID])
    .update("cellOrder", (cellOrder: ImmutableCellOrder) =>
      cellOrder.filterNot(id => id === cellID)
    );
};

export const deleteCell = (
  notebook: ImmutableNotebook,
  cellID: string
): ImmutableNotebook =>
  notebook
    .removeIn(["cellMap", cellID])
    .update("cellOrder", (cellOrder: ImmutableCellOrder) =>
      cellOrder.filterNot(id => id === cellID)
    );

export const monocellNotebook = appendCellToNotebook(
  emptyNotebook,
  emptyCodeCell
);
