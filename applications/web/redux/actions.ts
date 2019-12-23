const TOGGLE_SHOW_PANEL = "TOGGLE_SHOW_PANEL";
export const toggleShowPanel = (showPanel: boolean) => ({
  type: TOGGLE_SHOW_PANEL,
  payload: {
    showPanel
  }
});
