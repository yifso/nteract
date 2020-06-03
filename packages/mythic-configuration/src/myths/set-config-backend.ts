import { allDeprecations } from "../index";
import { configuration } from "../package";
import { ConfigurationBackend } from "../types";

export const setConfigBackend =
  configuration.createMyth("setConfigBackend")<ConfigurationBackend>({
    reduce: (state, action) =>
      state
        .set("backend", action.payload)
        .set("deprecations", allDeprecations()),

    thenDispatch: [
      (_, state) =>
        state.backend!.setup(),
    ],
  });
