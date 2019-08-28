/**
 * @module selectors
 */
import { AppState } from "@nteract/types";

import { createSelector } from "reselect";

/**
 * Returns the Jupyter comms data for a given nteract application.
 */
export const comms = (state: AppState) => state.comms;

/**
 * Returns the comms models that are stored in the nteract application state.
 */
export const models = createSelector(
  comms,
  comms => comms.get("models")
);
