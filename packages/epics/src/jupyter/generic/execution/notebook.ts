import * as actions from "@nteract/actions";
import { CellId } from "@nteract/commutable";
import { createExecuteRequest } from "@nteract/messaging";
import * as selectors from "@nteract/selectors";
import { AppState } from "@nteract/types";

import Immutable from "immutable";
import { ActionsObservable, StateObservable, ofType } from "redux-observable";

import { empty, of } from "rxjs";
import { concatMap, mergeMap, tap, switchMap } from "rxjs/operators";

export function executeAllCellsEpic(
  action$: ActionsObservable<
    actions.ExecuteAllCells | actions.ExecuteAllCellsBelow
  >,
  state$: StateObservable<AppState>
) {
  return action$.pipe(
    ofType(actions.EXECUTE_ALL_CELLS, actions.EXECUTE_ALL_CELLS_BELOW),
    concatMap(
      (action: actions.ExecuteAllCells | actions.ExecuteAllCellsBelow) => {
        const state = state$.value;
        const contentRef = action.payload.contentRef;

        const model = selectors.model(state, { contentRef });
        // If it's not a notebook, we shouldn't be here
        if (!model || model.type !== "notebook") {
          return empty();
        }

        let codeCellIds = Immutable.List();

        if (action.type === actions.EXECUTE_ALL_CELLS) {
          codeCellIds = selectors.notebook.codeCellIds(model);
        } else if (action.type === actions.EXECUTE_ALL_CELLS_BELOW) {
          codeCellIds = selectors.notebook.codeCellIdsBelow(model);
        }
        return of(
          ...codeCellIds.map((id: CellId) =>
            actions.executeCell({ id, contentRef: action.payload.contentRef })
          )
        );
      }
    )
  );
}

/**
 * the execute cell epic processes execute requests for all cells, creating
 * inner observable streams of the running execution responses
 */
export function executeCellEpic(
  action$: ActionsObservable<actions.ExecuteCell | actions.ExecuteFocusedCell>,
  state$: any
) {
  return action$.pipe(
    ofType(actions.EXECUTE_CELL, actions.EXECUTE_FOCUSED_CELL),
    mergeMap((action: actions.ExecuteCell | actions.ExecuteFocusedCell) => {
      if (action.type === actions.EXECUTE_FOCUSED_CELL) {
        const contentRef = action.payload.contentRef;
        const state = state$.value;
        const model = selectors.model(state, { contentRef });
        // If it's not a notebook, we shouldn't be here
        if (!model || model.type !== "notebook") {
          return empty();
        }

        const id = model.cellFocused;

        if (!id) {
          throw new Error("attempted to execute without an id");
        }
        return of(
          actions.executeCell({ id, contentRef: action.payload.contentRef })
        );
      }
      return of(action);
    }),
    tap((action: actions.ExecuteCell) => {
      if (!action.payload.id) {
        throw new Error("execute cell needs an id");
      }
    }),
    switchMap((action: actions.ExecuteCell) => {
      const { id } = action.payload;

      const state = state$.value;

      const contentRef = action.payload.contentRef;
      const model = selectors.model(state, { contentRef });

      // If it's not a notebook, we shouldn't be here
      if (!model || model.type !== "notebook") {
        return empty();
      }

      const cell = selectors.notebook.cellById(model, {
        id
      });
      if (!cell) {
        return empty();
      }

      // We only execute code cells
      if ((cell as any).get("cell_type") === "code") {
        const source = cell.get("source", "");

        const message = createExecuteRequest(source);

        return of(actions.sendExecuteRequest());
      }
      return empty();
    })
  );
}
