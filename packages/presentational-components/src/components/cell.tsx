import * as React from "react";

import styled from "styled-components";

import { Prompt } from "./prompt";

interface CellProps {
  /**
   * Indicates if a cell is selected
   */
  isSelected: boolean;
  /**
   * Indicates if hovering over a cell
   */
  _hovered: boolean;
  /**
   * Style children when a cell is selected or hovered over
   */
  children?: React.ReactNode;
}

const shadowLevels = {
  FLAT: `box-shadow: "none";`,
  HOVERED: `box-shadow: var(
    --theme-cell-shadow-hover,
    1px 1px 3px rgba(0, 0, 0, 0.12),
    -1px -1px 3px rgba(0, 0, 0, 0.12)
  );`,
  SELECTED: `box-shadow: var(
    --theme-cell-shadow-focus,
    3px 3px 9px rgba(0, 0, 0, 0.12),
    -3px -3px 9px rgba(0, 0, 0, 0.12)
  );`
};

const selectedPrompt = `
  background-color: var(--theme-cell-prompt-bg-focus, hsl(0, 0%, 90%));
  color: var(--theme-cell-prompt-fg-focus, hsl(0, 0%, 51%));
`;

const hoveredPrompt = `
  background-color: var(--theme-cell-prompt-bg-hover, hsl(0, 0%, 94%));
  color: var(--theme-cell-prompt-fg-hover, hsl(0, 0%, 15%));
`;

function cellShadowLevel(props: CellProps): string {
  if (props.isSelected) {
    return shadowLevels.SELECTED;
  }
  if (props._hovered) {
    return shadowLevels.HOVERED;
  }

  return shadowLevels.FLAT;
}

export const Cell = styled.div`
  & {
    position: relative;
    background: var(--theme-cell-bg, white);
    transition: all 0.1s ease-in-out;

    ${cellShadowLevel}
  }

  &:hover {
    ${(props: CellProps) =>
      // When selected, let that take precedence over hovered
      props.isSelected ? shadowLevels.SELECTED : shadowLevels.HOVERED}
  }

  /*
  Our cells conditionally style the prompt contained within based on if the cell is
  selected or hovered. To do this with styled-components we use their method of
  referring to other components:

  https://www.styled-components.com/docs/advanced#referring-to-other-components

  */
  & ${Prompt} {
    ${(props: CellProps) =>
      props.isSelected ? selectedPrompt : props._hovered ? hoveredPrompt : ``}
  }

  &:hover ${Prompt}, &:active ${Prompt} {
    ${(props: CellProps) =>
      props.isSelected
        ? // Allow isSelected to take precedence over hover
          ``
        : `background-color: var(--theme-cell-prompt-bg-hover, hsl(0, 0%, 94%));
    color: var(--theme-cell-prompt-fg-hover, hsl(0, 0%, 15%));`}
  }

  &:focus ${Prompt} {
    background-color: var(--theme-cell-prompt-bg-focus, hsl(0, 0%, 90%));
    color: var(--theme-cell-prompt-fg-focus, hsl(0, 0%, 51%));
  }
`;

Cell.displayName = "Cell";

Cell.defaultProps = {
  isSelected: false,
  _hovered: false,
  children: null
};
