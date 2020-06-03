import { createMythicPackage } from "@nteract/myths";
import { List, Map } from "immutable";
import { ConfigurationState } from "./types";

export const configuration =
  createMythicPackage("configuration")<ConfigurationState>({
    initialState: {
      backend: null,
      current: Map(),
      deprecations: List(),
    },
  });
