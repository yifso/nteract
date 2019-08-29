/**
 * @module selectors
 */
import { AppState } from "@nteract/types";

/**
 * Returns the theme of the notebook. Returns "light" if no theme is defined.
 *
 * @param   state   The state of the nteract application
 *
 * @returns         The theme of the nteract application
 */
export const userTheme = (state: AppState): string =>
  state.config.get("theme", "light");

/**
 * Returns the theme of the notebook. Returns "light" if no theme is defined.
 * This is an alias for the `userTheme` selector.
 *
 * @param   state   The state of the nteract application
 *
 * @returns         The theme of the nteract application
 */
export const currentTheme = userTheme;
