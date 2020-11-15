export { electronBackend } from "./backends/electron";

export * from "./types";

export { openExternalFile, openExternalUrl } from "./myths/open-external";
export { showWindow, closeWindow } from "./myths/window-lifecycle";
export { setWindowingBackend } from "./myths/window-registry";

export { windowing } from "./package";
