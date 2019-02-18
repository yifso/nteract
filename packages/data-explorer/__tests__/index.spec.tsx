import { shallow } from "enzyme";
import toJson from "enzyme-to-json";
import React from "react";

import { getDxProps } from "../__mocks__/dx-props";
import DataExplorer, { Props } from "../src/index";

describe("DataExplorerNoMetadata", () => {
  let dataExplorerProps: Props;
  beforeEach(() => {
    dataExplorerProps = getDxProps();
  });

  it("creates a data explorer with metadata", () => {
    const wrapper = shallow(<DataExplorer {...dataExplorerProps} />);

    expect(toJson(wrapper)).toMatchSnapshot();
  });
});

describe("DataExplorerMetadata", () => {
  let dataExplorerProps: Props;
  beforeEach(() => {
    dataExplorerProps = getDxProps();
  });

  it("creates a data explorer without metadata", () => {
    dataExplorerProps.metadata = {};
    const wrapper = shallow(<DataExplorer {...dataExplorerProps} />);

    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
