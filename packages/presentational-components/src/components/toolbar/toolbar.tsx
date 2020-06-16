import React, {
  FC,
  HTMLAttributes,
  ReactChild,
  useState,
  Component,
} from "react";
import classnames from "classnames";
import { ToolbarItem } from "./toolbar-item";

import { Commands, Expand, Collapse, ExpandSidebar } from "./Icons";

export interface Props extends HTMLAttributes<HTMLDivElement> {
  children?: ReactChild | JSX.Element[];
  onToggleFileBrowser: () => void;
}

export interface State {
  toolbarState: string;
}

const toolbarStates = {
  collapsed: "collapsed",
  expandedMin: "expandedMin",
  expandedMax: "expandedMax",
};

export class Toolbar extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      toolbarState: toolbarStates.collapsed,
    };
  }

  render() {
    const { children, onToggleFileBrowser } = this.props;
    const { toolbarState } = this.state;
    const isCollapsed = toolbarState === toolbarStates.collapsed;

    const className: string = classnames("toolbar", {
      expanded: toolbarState !== toolbarStates.collapsed,
    });

    return (
      <div className={className}>
        <span>
          <ToolbarItem
            image={<ExpandSidebar />}
            buttonClassName="toolbar-item-expand"
            text=""
            showText={!isCollapsed}
            onClick={onToggleFileBrowser}
          />

          {React.Children.map(
            children as React.ReactElement[],
            (child: React.ReactElement) =>
              React.cloneElement(child as React.ReactElement, {
                showText: !isCollapsed,
                showButton: !isCollapsed,
              })
          )}
        </span>
        {console.log(
          " TOOL BAR STATE ",
          toolbarState,
          toolbarState === toolbarStates.collapsed
        )}
        <ToolbarItem
          image={
            toolbarState === toolbarStates.collapsed ? <Expand /> : <Collapse />
          }
          text="Commands"
          showText={!isCollapsed}
          onClick={() => {
            this.setState((previous) => ({
              toolbarState:
                previous.toolbarState === toolbarStates.collapsed
                  ? toolbarStates.expandedMax
                  : toolbarStates.collapsed,
            }));
          }}
        />
      </div>
    );
  }
}
