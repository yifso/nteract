import * as React from "react";
// react-hot-loader uses proxies to the original elements so we need to use
// their comparison function in case a consumer of these components is
// using hot module reloading
import { areComponentsEqual } from "react-hot-loader";
import styled from "styled-components";

import { Icon } from "./icon";
import { LastSaved } from "./lastsaved";
import { Name } from "./name";

interface EntryProps {
  children: React.ReactNode;
}

const DirectoryEntry = styled.tr`
  border-top: 1px solid #eaecef;

  :hover {
    background-color: #f6f8fa;
    transition: background-color 0.1s ease-out;
  }

  & td:first-child {
    border-top: none;
  }

  & td:last-child {
    border-bottom: none;
    text-align: right;
    padding-right: 10px;
  }
`;

DirectoryEntry.displayName = "DirectoryEntry";

export class Entry extends React.PureComponent<EntryProps> {
  static defaultProps = {
    children: null
  };

  render() {
    return (
      <DirectoryEntry>
        {React.Children.map(this.props.children, (child, index: number) => {
          const childElement = child as React.ReactElement<any>;
          if (
            areComponentsEqual(
              childElement.type as React.ComponentType<any>,
              Icon
            ) ||
            areComponentsEqual(
              childElement.type as React.ComponentType<any>,
              Name
            )
          ) {
            return childElement;
          } else {
            return <td>{child}</td>;
          }
        })}
      </DirectoryEntry>
    );
  }
}
