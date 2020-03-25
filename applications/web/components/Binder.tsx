import * as React from "react";

import styled from "styled-components";

type Props = {
}

type State = {

}

const BinderDiv = styled.div`
    
`;

export default class Binder extends React.Component<Props, State> {
    constructor(props){
        super(props);
    }
    render() {
      return (
        <BinderDiv>  
            Binder
        </BinderDiv>    
      );
    }
  } 
