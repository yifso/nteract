import * as React from "react";

import styled from "styled-components";


const MenuDiv = styled.div`
    padding:20px;
    min-height:120px;
    border-bottom: 1px solid rgba(0,0,0,0.2);
    margin-bottom:50px;
`;

export class Menu extends React.Component {
    render() {
      return (
        <MenuDiv>  </MenuDiv>    
      );
    }
  }