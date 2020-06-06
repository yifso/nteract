import { Myth } from "@nteract/myths";
import { Map } from "immutable";
import { EMPTY, of } from "rxjs";
import { ConfigurationBackend } from "..";
// Because this is referenced in the initialization of the package, we can't do
// imports for our myths here; they need the package to be initialized first!

export const inMemoryConfigurationBackend: ConfigurationBackend = {
  setup: () => {
    let loadConfig: Myth | undefined;
    import("../myths/load-config")
      .then((myth) => loadConfig = myth.loadConfig);
    return of(loadConfig!.create(null));
  },

  load: () => {
    let setConfig: Myth | undefined;
    import("../myths/set-config")
      .then((myth) => setConfig = myth.setConfig);
    return of(setConfig!.create({}));
  },

  save: (_current: Map<string, any>) =>
    EMPTY,
};
