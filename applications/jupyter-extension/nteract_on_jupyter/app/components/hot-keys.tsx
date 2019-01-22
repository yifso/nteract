/**
 * Module was pulled and slightly modified from
 * https://github.com/jaywcjlove/react-hotkeys.
 * Demo: https://wangchujiang.com/react-hotkeys/
 *
 * React component to listen to keydown and keyup keyboard events,
 * defining and dispatching keyboard shortcuts. Uses a fork of hotkeys.js
 * for keydown detection of special characters. You give it a keymap of
 * shortcuts & it bind it to the mousetrap singleton. The, it'll unbind
 * it when the component unmounts.
 *
 * Supported keys ⇧, shift, option, ⌥, alt, ctrl, control, command, ⌘ .
 *   ⌘ Command()
 *   ⌃ Control
 *   ⌥ Option(alt)
 *   ⇧ Shift
 *   ⇪ Caps Lock
 *   fn Function key is fn (not supported)
 *   ↩︎ return/enter space space keys
 */
import Hotkeys, { FilterEvent } from "hotkeys-js";
import React from "react";

Hotkeys.filter = (event: FilterEvent) => {
  const tagName: string | undefined = event.target
    ? event.target.tagName
    : event.srcElement
    ? event.srcElement.tagName
    : undefined;

  if (tagName) {
    Hotkeys.setScope(
      /^(INPUT|TEXTAREA|SELECT)$/.test(tagName) ? "input" : "other"
    );
  }

  return true;
};

export interface IHotKeysHandle {
  key: string;
  method: () => void;
  mods: number[];
  scope: string;
  shortcut: string;
}

export interface IHotKeysProps {
  keyName: string;
  onKeyDown?: (combo: string, e: KeyboardEvent, handle: IHotKeysHandle) => void;
  onKeyUp?: (combo: string, e: KeyboardEvent, handle: IHotKeysHandle) => void;
}

export class HotKeys extends React.PureComponent<IHotKeysProps, {}> {
  handle: Partial<IHotKeysHandle> = {};
  isKeyDown: boolean = false;

  componentDidMount(): void {
    Hotkeys.unbind(this.props.keyName);
    Hotkeys(this.props.keyName, this.onKeyDown);
    document.addEventListener("keyup", this.handleKeyUpEvent);
  }

  componentWillUnmount(): void {
    Hotkeys.unbind(this.props.keyName);
    this.isKeyDown = true;
    this.handle = {};
    document.removeEventListener("keyup", this.handleKeyUpEvent);
  }

  onKeyUp = (e: KeyboardEvent, handle: any): void => {
    const { onKeyUp } = this.props;
    if (onKeyUp) {
      onKeyUp(handle.shortcut, e, handle);
    }
  };

  onKeyDown = (e: KeyboardEvent, handle: any): void => {
    const { onKeyDown } = this.props;
    if (this.isKeyDown) {
      return;
    }
    this.isKeyDown = true;
    this.handle = handle;
    if (onKeyDown) {
      onKeyDown(handle.shortcut, e, handle);
    }
  };

  handleKeyUpEvent = (e: KeyboardEvent) => {
    if (!this.isKeyDown) {
      return;
    }
    this.isKeyDown = false;
    if (
      this.handle.shortcut &&
      this.props.keyName.indexOf(this.handle.shortcut) < 0
    ) {
      return;
    }
    this.onKeyUp(e, this.handle);
    this.handle = {};
  };

  render(): {} | null {
    return this.props.children || null;
  }
}
