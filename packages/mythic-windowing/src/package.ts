import { createMythicPackage } from "@nteract/myths";
import { BrowserWindow } from "electron";
import * as Immutable from "immutable";
import { electronBackend } from "./backends/electron";
import { WindowingState } from "./types";


export const windowing = createMythicPackage("windowing")<
  WindowingState<BrowserWindow>
>({
  initialState: {
    backend: electronBackend,
    windows: Immutable.Map<string, BrowserWindow>(),
  },
});
