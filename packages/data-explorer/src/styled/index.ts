/**
 * Collection of Styled Components for the `DataExplorer`.
 * For more info, see: https://www.styled-components.com/docs.
 */

// Vendor modules
import styled from "styled-components";

export const MetadataWarningWrapper = styled.div`
  & {
    font-family: Source Sans Pro, Helvetica Neue, Helvetica, Arial, sans-serif;
  }
`;

export const MetadataWarningContent = styled.div`
  & {
    background-color: #cce;
    padding: 10px;
    padding-left: 20px;
  }
`;

export const FlexWrapper = styled.div`
  display: flex;
  flex-flow: row nowrap;
  width: 100%;
`;

export const FlexItem = styled.div`
  flex: 1;
`;

export const SemioticWrapper = styled.div`
  width: "calc(100vw - 200px)";
  .html-legend-item {
    color: var(--theme-app-fg);
  }

  .tick > path {
    stroke: lightgray;
  }

  .axis-labels,
  .ordinal-labels {
    fill: var(--theme-app-fg);
    font-size: 14px;
  }

  path.connector,
  path.connector-end {
    stroke: var(--theme-app-fg);
  }

  path.connector-end {
    fill: var(--theme-app-fg);
  }

  text.annotation-note-label,
  text.legend-title,
  .legend-item text {
    fill: var(--theme-app-fg);
    stroke: none;
  }

  .xyframe-area > path {
    stroke: var(--theme-app-fg);
  }

  .axis-baseline {
    stroke-opacity: 0.25;
    stroke: var(--theme-app-fg);
  }

  circle.frame-hover {
    fill: none;
    stroke: gray;
  }

  .rect {
    stroke: green;
    stroke-width: 5px;
    stroke-opacity: 0.5;
  }

  rect.selection {
    opacity: 0.5;
  }
`;
