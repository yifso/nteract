import * as React from "react";

import WidgetDisplay from "../src/index";

describe("WidgetDisplay", () => {
  it("can be rendered", () => {
    const model = {
      model_id: "someModeId",
      version_major: 2,
      version_minor: 0
    };
    expect(<WidgetDisplay data={model} />).not.toBeNull();
  });
});
