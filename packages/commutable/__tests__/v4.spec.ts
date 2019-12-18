import Immutable from "immutable";

import { createImmutableMetadata } from "../src/v4";

describe("createImmutableMetadata", () => {
  it("maps inputHidden metadata to specified format correctly", () => {
    const inputMetadata = {
      inputHidden: true
    };
    const outputMetadata = Immutable.Map({
      jupyter: {
        source_hidden: true
      }
    });
    expect(createImmutableMetadata(inputMetadata)).toEqual(outputMetadata);
  });
  it("maps outputHidden metadata to specificed format correctly", () => {
    const inputMetadata = {
      outputHidden: true
    };
    const outputMetadata = Immutable.Map({
      jupyter: {
        output_hidden: true
      }
    });
    expect(createImmutableMetadata(inputMetadata)).toEqual(outputMetadata);
  });
  it("doesn't create duplicate jupyter key for hidden data", () => {
    const inputMetadata = {
      outputHidden: true,
      inputHidden: true
    };
    const outputMetadata = Immutable.Map({
      jupyter: {
        output_hidden: true,
        source_hidden: true
      }
    });
    expect(createImmutableMetadata(inputMetadata)).toEqual(outputMetadata);
  });
});
