import * as React from "react";
import styled from "styled-components";

type ListingProps = {
  children: React.ReactNode;
};

const ListingRoot = styled.div`
  padding: 0px 0px 20px 0px;

  table {
    width: 100%;
    border-collapse: collapse;
    border-radius: 2px;
    border-spacing: 0;
  }
`;

ListingRoot.displayName = "ListingRoot";

export class Listing extends React.Component<ListingProps> {
  static defaultProps = {
    children: null
  };

  render() {
    return (
      <React.Fragment>
        <ListingRoot>
          <table>
            <tbody>{this.props.children}</tbody>
          </table>
        </ListingRoot>
      </React.Fragment>
    );
  }
}
