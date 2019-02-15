// Vendor imports
import numeral from "numeral";

// Local imports
import * as Dx from "./types";

export function numeralFormatting(tickValue: number): string {
  let format = "0.[00]a";
  if (tickValue === 0) {
    return "0";
  } else if (tickValue > 100000000000000 || tickValue < 0.00001) {
    format = "0.[000]e+0";
  } else if (tickValue < 1) {
    format = "0.[0000]a";
  }
  return numeral(tickValue).format(format);
}

export function createLabelItems(uniqueValues: string[]): any[] {
  return uniqueValues.map(value => ({ label: value }));
}

export const generateChartKey = ({
  view,
  lineType,
  areaType,
  selectedDimensions,
  selectedMetrics,
  pieceType,
  summaryType,
  networkType,
  hierarchyType,
  chart
}: {
  view: Dx.View;
  lineType: Dx.LineType;
  areaType: Dx.AreaType;
  selectedDimensions: string[];
  selectedMetrics: string[];
  pieceType: Dx.PieceType;
  summaryType: Dx.SummaryType;
  networkType: Dx.NetworkType;
  hierarchyType: Dx.HierarchyType;
  chart: Dx.Chart;
}) =>
  `${view}-${lineType}-${areaType}-${selectedDimensions.join(
    ","
  )}-${selectedMetrics.join(",")}-${pieceType}
  -${summaryType}-${networkType}-${hierarchyType}-${JSON.stringify(chart)}`;
