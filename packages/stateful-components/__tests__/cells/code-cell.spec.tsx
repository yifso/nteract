import React from "react";
import { shallow } from "enzyme";

import CodeCell from "../../src/cells/code-cell";

describe("CodeCell", () => {
  it("renders without crashing", () => {
    const component = shallow(
      <CodeCell contentRef={"aContentRef"} id={"testId"} />
    );
    expect(component).not.toBeNull();
    expect(component.find(".nteract-code-cell")).not.toBeNull();
  });
});
