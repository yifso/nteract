import { MythicAction, MythicPackage } from "@nteract/myths";
import { BrowserWindow } from "electron";
import * as Immutable from "immutable";
import { Observable } from "rxjs";


export type Window = BrowserWindow;
export type Windowing = MythicPackage<"windowing", WindowingState>;

export interface WindowingState {
  backend: WindowingBackend<Window>;
  windows: Immutable.Map<string, Window>;
}

export interface WindowingBackend<WINDOW> {
  showWindow: (props: WindowProps) => Observable<MythicAction>;
  closeWindow: (id: string, window?: WINDOW) => Observable<MythicAction>;
}

export interface WindowProps {
  id: string;
  kind?: "normal" | "splash";
  width: number;
  height: number;
  path?: string;
}
