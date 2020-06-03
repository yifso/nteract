import { fromJS, Map } from "immutable";
import { configuration } from "../package";

export const mergeConfig = configuration.createMyth("mergeConfig")<object>({
  reduce: (state, action) => {
    const initialConfig = fromJS(action.payload) as Map<string, any>;

    // Set new keys from deprecations
    const amendedConfig = state
      .get("deprecations")
      .filter((deprecation) => initialConfig.hasIn(deprecation.key.split(".")))
      .reduce((outerConfig, deprecation) =>
        Object
          .entries(
            deprecation.changeTo(outerConfig.getIn(deprecation.key.split(".")))
          )
          .filter(
            ([key, _]) => !outerConfig.hasIn(key.split("."))
          )
          .reduce(
            (innerConfig, [key, value]) =>
              innerConfig.setIn(key.split("."), value),
            outerConfig,
          ),
        initialConfig,
      );

    // Remove old keys from deprecations
    const config = state
      .get("deprecations")
      .filter((deprecation) => initialConfig.hasIn(deprecation.key.split(".")))
      .reduce((outerConfig, deprecation) =>
        outerConfig.removeIn(deprecation.key.split(".")),
        amendedConfig,
      );

    return state.set("current", config);
  },
});
