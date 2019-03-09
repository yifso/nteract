import * as React from "react";
import styled from "styled-components";

const FlexItem = styled.div`
  flex: 1;
  min-width: 0;
`;

interface Props {
  children: React.ReactNode;
  // How we tell the root DataExplorer to pass the visual/display as children:
  componentType: "display";
}

function PlaceHolder() {
  return <div>This should be a display element!</div>;
}

Display.defaultProps = { componentType: "display", children: <PlaceHolder /> };

export function Display({ children, componentType }: Props) {
  return <FlexItem>{children}</FlexItem>;
}
