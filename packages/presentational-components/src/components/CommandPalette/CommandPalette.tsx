import React, {
  FC,
  ReactNode,
  ReactNodeArray,
  HTMLAttributes,
  EventHandler,
  SyntheticEvent,
} from "react";
import "./CommandPalette.css";
import { Commands } from "../Icons";
import { KeyTag } from "./KeyTag";

export interface Props
  extends HTMLAttributes<HTMLDivElement & HTMLInputElement> {
  shortCut: string[];
  children: ReactNode | ReactNodeArray;
  isVisible?: boolean;
  onClose: () => void;
  onChangeFilter: (value: string) => void;
}

export class CommandPalette extends React.PureComponent<Props> {
  componentDidMount() {
    const element: any = document.querySelector(".command-palette input");
    element.focus();
  }

  handleChangeFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.props.onChangeFilter(e.target.value);
  };

  render() {
    const { isVisible, onClose, shortCut, onChange, children } = this.props;

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
              onChange={this.handleChangeFilter}
              type="text"
              name="commandFilter"
              id="commandFilter"
              placeholder="Filter commands"
            />
          </div>
          <div className="items">{children}</div>
        </div>
      </React.Fragment>
    );
  }
}
