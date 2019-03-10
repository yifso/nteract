import { shallow } from "enzyme";
import toJson from "enzyme-to-json";
import React from "react";

import { getDxProps } from "../__mocks__/dx-props";
import DataExplorer, { Display, Props, Toolbar } from "../src/index";
import * as Dx from "../src/types";

describe("DataExplorerNoMetadata", () => {
  let dataExplorerProps: Props;
  beforeEach(() => {
    dataExplorerProps = getDxProps();
  });

  it("creates a data explorer with metadata", () => {
    const wrapper = shallow(
      <DataExplorer {...dataExplorerProps}>
        <Display />
        <Toolbar />
      </DataExplorer>
    );

    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it("provides a default primaryKey if none provided", () => {
    delete dataExplorerProps.data.schema.primaryKey;
    const wrapper = shallow(
      <DataExplorer {...dataExplorerProps}>
        <Display />
        <Toolbar />
      </DataExplorer>
    );

    expect(wrapper.state("primaryKey")).toEqual([Dx.defaultPrimaryKey]);
    // The range index should be equivalent to the array index, [0,1,2,...n]
    const data = wrapper.state("data");
    expect(
      (data as any[]).filter(
        (datapoint, index) => datapoint[Dx.defaultPrimaryKey] !== index
      )
    ).toEqual([]);
  });
});

describe("DataExplorerMetadata", () => {
  let dataExplorerProps: Props;
  beforeEach(() => {
    dataExplorerProps = getDxProps();
  });

  it("creates a data explorer without metadata", () => {
    delete dataExplorerProps.metadata;
    const wrapper = shallow(
      <DataExplorer {...dataExplorerProps}>
        <Display />
        <Toolbar />
      </DataExplorer>
    );

    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
