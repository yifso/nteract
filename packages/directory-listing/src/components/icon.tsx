import { Book, FileDirectory, FileText } from "@nteract/octicons";
import * as React from "react";
import styled from "styled-components";

interface IconProps {
  color: string;
  fileType: "unknown" | "notebook" | "directory" | "file" | "dummy";
}

const IconTD = styled.td`
  padding-right: 2px;
  padding-left: 10px;
  width: 17px;
  vertical-align: middle;
  text-align: center;
  opacity: 0.95;
  color: ${props => props.color || "#0366d6"};
`;

IconTD.displayName = "IconTD";

export class Icon extends React.Component<IconProps> {
  static defaultProps: Partial<IconProps> = {
    fileType: "file",
    color: "#0366d6"
  };

  render() {
    let icon = <FileText />;
    switch (this.props.fileType) {
      case "notebook":
        icon = <Book />;
        break;
      case "directory":
        icon = <FileDirectory />;
        break;
      case "file":
        icon = <FileText />;
        break;
      default:
        icon = <FileText />;
    }

    return <IconTD style={{ color: this.props.color }}>{icon}</IconTD>;
  }
}
