import React, {  HTMLAttributes} from "react";
import styled from "styled-components";

export const H3 = styled.h3<Props>`
  font-size: 25px;
`

export const P = styled.p<Props>`
  font-size: 16px;
  width: 700px;
  line-height: 24px;

  a {
      text-decoration: none;
  }
`

export interface Props extends HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

