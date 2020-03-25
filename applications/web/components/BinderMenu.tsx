import * as React from "react";

import styled from "styled-components";


const BinderMenuDiv = styled.div`
    border-bottom:1px solid #d1e3dd;
    padding:20px;
    display: flex;
    

    input,select{
        margin-left: 20px;
        outline: none;
        background-color:#fff;
        border:1px solid #d1e3dd;
        border-radius: 3px;
        padding-left: 10px;
        padding-right: 10px;
    }

    .submit-button{
        background-color:#0e6ba8;
        color: #fff;
        height:34px;
        border-radius:3px;
        border:1px solid #0e6ba8;
        cursor:pointer;
    }

    .submit-button:hover{
        background-color:#0a2472;
        border:1px solid #0a2472;
    }

    .binder-logo {
    width: 60px;
    display: block;
  }

`;

export default class BinderMenu extends React.Component {
    constructor(props){
        super(props);
    }
    render() {
      return (
        <BinderMenuDiv>  
            <img
            className="binder-logo"
            src="https://mybinder.org/static/logo.svg?v=f9f0d927b67cc9dc99d788c822ca21c0"
          />
                <select defaultValue="gh">
                    <option value="gh">Github</option>
                </select>
                <input 
                    placeholder="Organization/username" />
                <input 
                    placeholder="Repository" />
                <input 
                    placeholder="Branch" />
                <input 
                    type="submit" 
                    className="submit-button" value="Launch"/>
        </BinderMenuDiv>    
      );
    }
  } 
