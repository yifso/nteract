import { BrowserWindow } from "electron";
import { of } from "rxjs";
import { deregisterWindow, registerWindow } from "../../myths/window-registry";
import { WindowingBackend, WindowProps } from "../../types";


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

    return of(registerWindow.create({ id, window }));
  },

  closeWindow: (id: string, window?: BrowserWindow) => {
    window?.close();
    return of(deregisterWindow.create(id));
  }
}
