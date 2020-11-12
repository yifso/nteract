import { BrowserWindow, shell } from "electron";
import { EMPTY, of } from "rxjs";
import { forgetWindow, rememberWindow } from "../../myths/window-registry";
import { WindowingBackend, WindowProps, WindowRef } from "../../types";


export const electronBackend: WindowingBackend<BrowserWindow> = {
  showWindow: ({id, width, height, path, kind}: WindowProps) => {
    const window = new BrowserWindow({
      width,
      height,
      useContentSize: true,
      title: "loading",
      frame: false,
      show: false,
    });

    window.loadURL(`file://${path}`);
    window.once("ready-to-show", () => {
      window.show();
    });

    return of(rememberWindow.create({ id, window }));
  },

  closeWindow: (id: WindowRef, window?: BrowserWindow) => {
    window?.close();
    return of(forgetWindow.create(id));
  },

  openExternalUrl: (url: string) => {
    shell.openExternal(url).then();
    return EMPTY;
  }
}
