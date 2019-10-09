import * as React from "react";

import BackboneWrapper from "../../src/renderer/backbone-wrapper";
import Backbone from "backbone";

describe("BackboneWrapper", () => {
  it("can be rendered", () => {
    expect(
      <BackboneWrapper
        model={new Backbone.Model({ model_name: "TestModel" })}
      />
    ).not.toBeNull();
  });
});
