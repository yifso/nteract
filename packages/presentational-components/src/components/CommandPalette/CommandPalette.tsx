import React, { FC, ReactNode, ReactNodeArray, HTMLAttributes } from "react";
import "./CommandPalette.css";
import { Commands } from "../Icons";
import { KeyTag } from "./KeyTag";

export interface Props
  extends HTMLAttributes<HTMLDivElement & HTMLInputElement> {
  shortCut: string[];
  children: ReactNode | ReactNodeArray;
  isVisible?: boolean;
  onClose: () => void;
}

export class CommandPalette extends React.Component<Props> {
  componentDidMount() {
    document.querySelector(".command-palette input").focus();
  }

  render() {
    const {
      isVisible,
      onClose,
      shortcutKey,
      shortCut,
      onChange,
      children,
    } = this.props;

    const mainClassName = isVisible
      ? "command-palette visible"
      : "command-palette";
    return (
      <React.Fragment>
        <div className="command-palette-overlay" onClick={onClose} />
        <div className={mainClassName} tabIndex={-1}>
          <div className="command-palette-row">
            <Commands muted />
            <KeyTag>
              Hide Menu Bar
              {shortCut.map((shortcutKey) => (
                <KeyTag mini>{shortcutKey}</KeyTag>
              ))}
            </KeyTag>
          </div>
          <div className="command-palette-input-row">
            <label htmlFor="commandFilter">Filter commands</label>
            <input
              onChange={(e) => onChange(e.target.value)}
              type="text"
              name="commandFilter"
              id="commandFilter"
            />
          </div>
          <div class="items">{children}</div>
        </div>
      </React.Fragment>
    );
  }
}
