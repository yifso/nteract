import * as React from "react";
import styled from "styled-components";

type NameProps = {
  children: React.ReactNode;
};

class PlainName extends React.Component<NameProps> {
  static defaultProps = {
    children: null
  };

  render() {
    return <td>{this.props.children}</td>;
  }
}

export const Name = styled(PlainName)`
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
