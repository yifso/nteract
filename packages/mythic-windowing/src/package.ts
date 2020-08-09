import { createMythicPackage } from "@nteract/myths";
import * as Immutable from "immutable";
import { Window, Windowing, WindowingBackend } from "./types";


export const windowing: Windowing = createMythicPackage("windowing")({
  initialState: {
    backend: null as unknown as WindowingBackend<Window>,
    windows: Immutable.Map<string, Window>(),
  },
});
