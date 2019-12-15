import * as React from "react";

import styled, { StyledComponent } from "styled-components";

interface ErrorProps {
  className?: string;
  error?: Error;
}

export const Error = (props: ErrorProps) =>
  props.error
    ?
      <p className={props.className}>
        <b>{props.error.name ?? "Error"}:</b> {props.error.message}
      </p>
    : null;

const StyledError = styled(Error)`
  background: var(--jp-error-color3);
  color: var(--jp-error-color0);
  border: 1px solid;
  padding: 0.5ex;
`;

export default StyledError;
