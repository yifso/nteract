import * as React from "react";
import { areComponentsEqual } from "react-hot-loader";

import { Icon } from "./icon";
import { Name } from "./name";
import { LastSaved } from "./lastsaved";

type EntryProps = {
  children: React.ReactNode
};

export class Entry extends React.Component<EntryProps> {
  static defaultProps = {
    children: null
  };

  render() {
    return (
      <tr className="directory-entry">
        {React.Children.map(this.props.children, (child) => {
          const childElement = child as React.ReactElement<any>;
          if (
            areComponentsEqual(childElement.type as React.ComponentType<any>, Icon) ||
            areComponentsEqual(childElement.type as React.ComponentType<any>, Name) ||
            areComponentsEqual(childElement.type as React.ComponentType<any>, LastSaved)
          ) {
            return React.cloneElement(childElement, {
              className:
                typeof childElement.props.className === "string" &&
                childElement.props.className !== ""
                  ? childElement.props.className + " directory-entry-field"
                  : "directory-entry-field"
            });
          } else {
            return <td className="directory-entry-field">{child}</td>;
          }
        })}
        <style jsx>{`
          tr {
            border-top: 1px solid #eaecef;
          }

          tr:hover {
            background-color: #f6f8fa;
            transition: background-color 0.1s ease-out;
          }

          tr:first-child {
            border-top: none;
          }

          tr:last-child {
            border-bottom: none;
          }
        `}</style>
      </tr>
    );
  }
}
