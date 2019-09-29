import * as React from "react";

import Backbone from "backbone";
import BackboneWrapper from "../../src/renderer/backbone-wrapper";

describe("BackboneWrapper", () => {
  it("can be rendered", () => {
    expect(
      <BackboneWrapper
        model={new Backbone.Model({ model_name: "TestModel" })}
      />
    ).not.toBeNull();
  });
});
