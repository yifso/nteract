import { MythicAction, MythicPackage } from "@nteract/myths";
import { BrowserWindow } from "electron";
import * as Immutable from "immutable";
import { Observable } from "rxjs";


export type Window = BrowserWindow;
export type WindowRef = string;
export type Windowing = MythicPackage<"windowing", WindowingState>;

export interface WindowingState {
  backend: WindowingBackend<Window>;
  windows: Immutable.Map<WindowRef, Window>;
}

export interface WindowingBackend<WINDOW> {
  showWindow: (props: WindowProps) => Observable<MythicAction>;
  closeWindow: (id: WindowRef, window?: WINDOW) => Observable<MythicAction>;
  openExternalUrl: (url: string) => Observable<MythicAction>;
}

export interface WindowProps {
  id: WindowRef;
  kind?: "normal" | "splash";
  width: number;
  height: number;
  path?: string;
}
