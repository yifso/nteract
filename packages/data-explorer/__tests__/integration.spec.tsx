import { mount, shallow } from "enzyme";
import toJson from "enzyme-to-json";
import React from "react";

import { getDxProps } from "../__mocks__/dx-props";
import DataExplorerDefault, {
  DataExplorer,
  Display,
  Props,
  Toolbar
} from "../src/index";

import * as Dx from "../src/types";

import {
  DisplayData,
  ExecuteResult,
  KernelOutputError,
  Media,
  Output,
  RichMedia,
  StreamText
} from "@nteract/outputs";

describe("Usage with @nteract/outputs", () => {
  let dataExplorerProps: Props;
  let testOutput;
  beforeEach(() => {
    dataExplorerProps = getDxProps();
    testOutput = {
      output_type: "display_data",
      data: {
        "application/vnd.dataresource+json": dataExplorerProps.data,
        "text/html": "<p>This is some HTML that <b>WILL</b> render</p>",
        "text/plain": "This is some plain text that WILL NOT render"
      },
      metadata: {}
    };
  });

  function Usage(props) {
    // This example tests nested RichMedia usage, see #4250

    return (
      <Output output={props.output}>
        <DisplayData>
          <DataExplorerDefault />
          <Media.HTML />
          <Media.Json />
          <Media.Plain />
        </DisplayData>
        {/* <ExecuteResult>{richMedia}</ExecuteResult> */}
      </Output>
    );
  }

  it("Renders the default DataExplorer export", () => {
    const wrapper = mount(<Usage output={testOutput} />);
    expect(wrapper.find(DataExplorerDefault).exists()).toEqual(true);
  });
});
