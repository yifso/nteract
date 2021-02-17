import { isImmutable, List } from "immutable";
import { isEqual, result, set, unset } from "lodash";
import { setConfigAtKey } from "./myths/set-config-at-key";
import { configuration } from "./package";
import { ConfigurationOption, ConfigurationOptionDefinition, ConfigurationOptionDeprecatedDefinition, HasPrivateConfigurationState } from "./types";

export { configuration } from "./package";
export { setConfigAtKey } from "./myths/set-config-at-key"
export { toggleConfigAtKey } from "./myths/toggle-config-at-key"
export * from "./types";

const options: {[key: string]: ConfigurationOption} = {};
const deprecated: {[key: string]: <T>(value: T) => { [key: string]: T }} = {};

const strippedToDefinition = <T>(option: ConfigurationOptionDefinition<T>) => {
  // Make a copy and trim everything down to just the spec
  const definition: ConfigurationOptionDefinition<T> = {...option};

  unset(definition, "value");
  unset(definition, "selector");
  unset(definition, "action");

  return definition;
}

export const defineConfigOption = <TYPE>(
  props: ConfigurationOptionDefinition<TYPE>,
) => {
  if (props.key in deprecated) {
    throw new Error(`Duplicate deprecated configuration option "${props.key}"`);
  }

  if (props.key in options) {
    const oldSpec = strippedToDefinition(options[props.key]);
    const newSpec = strippedToDefinition(props);

    if (!isEqual(oldSpec, newSpec)) {
      console.group(`Duplicate configuration option "${props.key}"`)
      console.log("old config option spec:", oldSpec);
      console.log("new config option spec:", newSpec);
      console.groupEnd()

      throw new Error(`Duplicate configuration option "${props.key}"`);
    }
  }

  options[props.key] = {
    ...props,
    value: props.defaultValue,
    selector: configuration.createSelector(
      state => {
        const value =
          state?.current?.getIn(props.key.split(".")) ?? props.defaultValue;

        return isImmutable(value)
          ? value.toJS()
          : value;
      }
    ),
    action: (value: TYPE) => setConfigAtKey.create({ key: props.key, value }),
  };

  return options[props.key];
};

export const createDeprecatedConfigOption = <TYPE>(
  props: ConfigurationOptionDeprecatedDefinition,
) => {
  if (props.key in options) {
    throw new Error(`Duplicate deprecated configuration option "${props.key}"`);
  }

  if (props.key in deprecated && props.changeTo !== deprecated[props.key]) {
    throw new Error(`Duplicate deprecated configuration option "${props.key}"`);
  }

  deprecated[props.key] = props.changeTo;
}

export const createConfigCollection = <TYPE>(
  { key }: { key: string },
) => configuration.createSelector(
  state => {
    const actual = {
      [key]: state?.current?.get(key)?.toJS() ?? {}
    };

    Object
      .entries(options)
      .filter(([optionKey, _]) => optionKey.startsWith(`${key}.`))
      .filter(([optionKey, _]) => result(actual, optionKey) === undefined)
      .forEach(([optionKey, option]) =>
        set(actual, optionKey, option.defaultValue),
      );

    return actual[key];
  },
);

export const allConfigOptionDefinitions = () =>
  Object.values(options).map(strippedToDefinition);

export const allConfigOptions = (state?: HasPrivateConfigurationState) => {
  const all = Object.values(options);

  if (state !== undefined) {
    return all.map(x => ({
      ...x,
      value: x.selector(state),
    }));
  }
  else {
    return all;
  }
};

export const configOption = (key: string) => {
  return options[key];
};

export const allDeprecations = () => {
  return List(Object.entries(deprecated).map(([key, changeTo]) => ({
    key,
    changeTo,
  })));
}

// Export the filesystem backend's function for loading config. This export will
// fail in the browser since it does not have the transitively depended 'fs'
// package, so guard against that for our dear browser-bound friends.
export const setConfigFile = (function () {
  // Try to return the actually requested function (works on node & electron)
  try {
    // This import fails in the browser due to fs-observable dependencies.
    // Attempt the import using a non-literal string to gently dissuade webpack
    // and similar creatures from pre-processing the `require` (which fails in a
    // non-catchable way).
    const fsBackendPath = "./backends/filesystem";
    const fsBackend = require(fsBackendPath);

    // Some browsers define 'require', and maybe they will return something
    // falsy instead of throwing so let's make sure that's not happening.
    if (fsBackend === undefined || fsBackend.setConfigFile === undefined) {
      throw new Error(`Looked for 'setConfigFile' but couldn't find it on imported mythic-configuration/backends/filesystem: ${JSON.stringify(fsBackend)}`);
    }

    return fsBackend.setConfigFile;
  } catch (requireErr) {
    // Ono the import failed! Not a showstopper for browser users. Return a
    // version of the function that yells if you use it.
    return (filename: string) => {
      const err = Error("Failed to load mythic-configuration's filesystem backend. You're probably running in a browser, but this only works in a node runtime!");
      err.stack += "\nCaused by " + requireErr.stack;
      throw err;
    }
  }
})();
