import { MythicAction } from "@nteract/myths";
import { BrowserWindow } from "electron";
import * as Immutable from "immutable";
import { Observable } from "rxjs";

export interface WindowProps {
  id: string;
  kind?: "normal" | "splash";
  width: number;
  height: number;
  path?: string;
}

export interface WindowingBackend<T> {
  showWindow: (props: WindowProps) => Observable<MythicAction>;
  closeWindow: (id: string, window?: T) => Observable<MythicAction>;
}

export interface WindowingState<T> {
  backend: WindowingBackend<T>;
  windows: Immutable.Map<string, T>;
}
