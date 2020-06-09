import React, { HTMLAttributes } from "react";

import classnames from "classnames";

import "./CellMenu.css";

interface CellMenuProps extends React.FC<HTMLAttributes<HTMLDivElement>> {
  visible: boolean;
}

export type Props = React.FC<HTMLAttributes<HTMLUListElement>>;
export type MenuItemProps = React.FC<HTMLAttributes<HTMLLIElement>>;

export const CellMenuSection: Props = ({ children }) => {
  return <ul className="cell-menu-section">{children}</ul>;
};

export const CellMenuItem: MenuItemProps = ({
  children,
  className,
  ...props
}) => {
  return (
    <li
      className={classnames("cell-menu-item", className)}
      {...props}
      tabIndex={-1}
    >
      {children}
    </li>
  );
};

export const CellMenu: React.FC<CellMenuProps> = ({ visible, children }) => {
  return (
    <div className={visible ? "cell-menu" : "cell-menu-hidden cell-menu"}>
      {children}
    </div>
  );
};
