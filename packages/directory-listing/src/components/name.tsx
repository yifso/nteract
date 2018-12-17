import * as React from "react";
import styled from "styled-components";

type NameProps = {
  children: React.ReactNode;
};

const NameTD = styled.td`
  vertical-align: middle;
  font-size: 0.9em;
  padding: 8px;

  a {
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
    outline-width: 0;
  }
`;

export class Name extends React.Component<NameProps> {
  static defaultProps = {
    children: null
  };

  render() {
    return <NameTD>{this.props.children}</NameTD>;
  }
}
