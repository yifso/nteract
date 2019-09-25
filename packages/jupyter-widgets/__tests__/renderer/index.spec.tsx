import * as React from "react";

import Renderer from "../../src/renderer/index";

describe("Renderer", () => {
  it("can be rendered", () => {
    expect(<Renderer />).not.toBeNull();
  });
});
