// Vendor modules
import * as React from "react";

// Local modules
import DataResourceTransformGrid from "./charts/grid";
import { semioticSettings } from "./charts/settings";
import { MetadataWarning } from "./components/MetadataWarning";
import { Toolbar } from "./components/Toolbar";
import { colors } from "./settings";
import { FlexItem, FlexWrapper, SemioticWrapper } from "./styled";
import * as Dx from "./types";
import { generateChartKey } from "./utilities";
import VizControls from "./VizControls";

// Constants
const mediaType = "application/vnd.dataresource+json";
const defaultResponsiveSize = [500, 300];
const defaultHeight = 500;

interface Props {
  /**
   * A pandas data object
   * e.g.
   * ```typescript
   * {
   *  shema: {},
   *  data: []
   * }
   * ```
   */
  data: Dx.DataProps;
  /**
   * An object that represents the current state of the Data Explorer.
   * e.g.
   * ```typescript
   * ```
   */
  metadata: Dx.Metadata;
  /**
   *
   */
  theme?: string;
  /**
   *
   */
  expanded?: boolean;
  /**
   *
   */
  height?: number;
  /**
   *
   */
  mediaType: "application/vnd.dataresource+json";
  /**
   *
   */
  initialView: Dx.View;
  /**
   *
   */
  onMetadataChange?: (
    { dx }: { dx: Dx.DxMetaProps },
    mediaType: string
  ) => void;
}

interface State {
  view: Dx.View;
  colors: string[];
  metrics: Dx.Field[];
  dimensions: Dx.Dimension[];
  selectedMetrics: string[];
  selectedDimensions: string[];
  networkType: Dx.NetworkType;
  hierarchyType: Dx.HierarchyType;
  pieceType: Dx.PieceType;
  summaryType: Dx.SummaryType;
  lineType: Dx.LineType;
  areaType: Dx.AreaType;
  chart: Dx.Chart;
  displayChart: Dx.DisplayChart;
  primaryKey: string[];
  data: Dx.Datapoint[];
}

class DataExplorer extends React.PureComponent<Partial<Props>, State> {
  static MIMETYPE: string = mediaType;

  static defaultProps: Partial<Props> = {
    metadata: {
      dx: {}
    },
    height: defaultHeight,
    mediaType,
    initialView: "grid"
  };

  constructor(props: Props) {
    super(props);

    const { metadata, initialView } = props;

    // Handle case of metadata being empty yet dx not set
    const dx = metadata.dx || {};
    const chart = dx.chart || {};

    const { fields = [], primaryKey = [] } = props.data.schema;

    const dimensions = fields.filter(
      field =>
        field.type === "string" ||
        field.type === "boolean" ||
        field.type === "datetime"
    ) as Dx.Dimension[];

    // Should datetime data types be transformed into js dates before
    // getting to this resource?
    const data = props.data.data.map(datapoint => {
      const mappedDatapoint: Dx.Datapoint = {
        ...datapoint
      };
      fields.forEach(field => {
        if (field.type === "datetime") {
          mappedDatapoint[field.name] = new Date(mappedDatapoint[field.name]);
        }
      });
      return mappedDatapoint;
    });

    const metrics = fields
      .filter(
        field =>
          field.type === "integer" ||
          field.type === "number" ||
          field.type === "datetime"
      )
      .filter(
        field => !primaryKey.find(pkey => pkey === field.name)
      ) as Dx.Metric[];

    const displayChart: Dx.DisplayChart = {};

    this.state = {
      view: initialView,
      lineType: "line",
      areaType: "hexbin",
      selectedDimensions: [],
      selectedMetrics: [],
      pieceType: "bar",
      summaryType: "violin",
      networkType: "force",
      hierarchyType: "dendrogram",
      dimensions,
      metrics,
      colors,
      chart: {
        metric1: (metrics[0] && metrics[0].name) || "none",
        metric2: (metrics[1] && metrics[1].name) || "none",
        metric3: "none",
        dim1: (dimensions[0] && dimensions[0].name) || "none",
        dim2: (dimensions[1] && dimensions[1].name) || "none",
        dim3: "none",
        timeseriesSort: "array-order",
        networkLabel: "none",
        ...chart
      },
      displayChart,
      primaryKey,
      data,
      ...dx
    };
  }

  componentDidMount(): void {
    // This is necessary to render any charts based on passed metadata
    // because the grid doesn't result from the updateChart function
    // but any other view does
    if (this.state.view !== "grid") {
      this.updateChart(this.state);
    }
  }

  updateChart = (updatedState: Partial<State>) => {
    const {
      view,
      dimensions,
      metrics,
      chart,
      lineType,
      areaType,
      selectedDimensions,
      selectedMetrics,
      pieceType,
      summaryType,
      networkType,
      hierarchyType,
      colors,
      primaryKey,
      data: stateData
    } = { ...this.state, ...updatedState };

    if (!this.props.data && !this.props.metadata && !this.props.initialView) {
      return;
    }

    const { data, height, onMetadataChange } = this.props;

    const { Frame, chartGenerator } = semioticSettings[view];

    const chartKey = generateChartKey({
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
    });

    const frameSettings = chartGenerator(stateData, data!.schema, {
      metrics,
      dimensions,
      chart,
      colors,
      height,
      lineType,
      areaType,
      selectedDimensions,
      selectedMetrics,
      pieceType,
      summaryType,
      networkType,
      hierarchyType,
      primaryKey,
      setColor: this.setColor
    });

    const display: React.ReactNode = (
      <SemioticWrapper>
        <Frame
          responsiveWidth
          size={defaultResponsiveSize}
          {...frameSettings}
        />
        <VizControls
          {...{
            data: stateData,
            view,
            chart,
            metrics,
            dimensions,
            selectedDimensions,
            selectedMetrics,
            hierarchyType,
            summaryType,
            networkType,
            updateChart: this.updateChart,
            updateDimensions: this.updateDimensions,
            setLineType: this.setLineType,
            updateMetrics: this.updateMetrics,
            lineType,
            setAreaType: this.setAreaType,
            areaType
          }}
        />
      </SemioticWrapper>
    );

    // If you pass an onMetadataChange function, then fire it and
    // pass the updated dx settings so someone upstream can update
    // the metadata or otherwise use it
    if (onMetadataChange) {
      onMetadataChange(
        {
          ...this.props.metadata,
          dx: {
            view,
            lineType,
            areaType,
            selectedDimensions,
            selectedMetrics,
            pieceType,
            summaryType,
            networkType,
            hierarchyType,
            colors,
            chart
          }
        },
        mediaType
      );
    }

    this.setState(
      (prevState): any => {
        return {
          ...updatedState,
          displayChart: {
            ...prevState.displayChart,
            [chartKey]: display
          }
        };
      }
    );
  };

  setView = (view: Dx.View) => this.updateChart({ view });

  setGrid = () => this.setState({ view: "grid" });

  setColor = (newColorArray: string[]) =>
    this.updateChart({ colors: newColorArray });

  setLineType = (selectedLineType: Dx.LineType) =>
    this.updateChart({ lineType: selectedLineType });

  setAreaType = (selectedAreaType: Dx.AreaType) =>
    this.updateChart({ areaType: selectedAreaType });

  updateDimensions = (selectedDimension: string) => {
    const oldDims = this.state.selectedDimensions;
    const newDimensions =
      oldDims.indexOf(selectedDimension) === -1
        ? [...oldDims, selectedDimension]
        : oldDims.filter(dimension => dimension !== selectedDimension);
    this.updateChart({ selectedDimensions: newDimensions });
  };

  updateMetrics = (selectedMetric: string) => {
    const oldMetrics = this.state.selectedMetrics;
    const newMetrics =
      oldMetrics.indexOf(selectedMetric) === -1
        ? [...oldMetrics, selectedMetric]
        : oldMetrics.filter(metric => metric !== selectedMetric);
    this.updateChart({ selectedMetrics: newMetrics });
  };

  render(): JSX.Element {
    const {
      view,
      dimensions,
      chart,
      lineType,
      areaType,
      selectedDimensions,
      selectedMetrics,
      pieceType,
      summaryType,
      networkType,
      hierarchyType
    } = this.state;

    let display: React.ReactNode = null;

    if (view === "grid") {
      display = <DataResourceTransformGrid {...this.props as Props} />;
    } else if (
      [
        "line",
        "scatter",
        "bar",
        "network",
        "summary",
        "hierarchy",
        "hexbin",
        "parallel"
      ].includes(view)
    ) {
      const chartKey = generateChartKey({
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
      });

      display = this.state.displayChart[chartKey];
    }

    return (
      <div>
        <MetadataWarning metadata={this.props.metadata!} />
        <FlexWrapper>
          <FlexItem>{display}</FlexItem>
          <Toolbar
            dimensions={dimensions}
            setGrid={this.setGrid}
            setView={this.setView}
            currentView={view}
          />
        </FlexWrapper>
      </div>
    );
  }
}

export default DataExplorer;
