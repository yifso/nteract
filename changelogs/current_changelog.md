# YYYY/MM/DD nteract Release

## Changelog

## Applications

### nteract desktop app

#### Breaking Changes

Provide a bulleted list of breaking changes and a reference to the PR(s) containing those changes.

#### New Features

Provide a bulleted list of new features or improvements and a reference to the PR(s) containing these changes.

#### Bug Fixes

Provide a bulleted list of bug fixes and a reference to the PR(s) containing the changes.

## Core SDK Packages

### @nteract/actions ([publish-version-here])

#### Breaking Changes

Provide a bulleted list of breaking changes and a reference to the PR(s) containing those changes.

#### New Features

Provide a bulleted list of new features or improvements and a reference to the PR(s) containing these changes.

#### Bug Fixes

Provide a bulleted list of bug fixes and a reference to the PR(s) containing the changes.

### @nteract/commutable ([publish-version-here])

#### Breaking Changes

Provide a bulleted list of breaking changes and a reference to the PR(s) containing those changes.

#### New Features

Provide a bulleted list of new features or improvements and a reference to the PR(s) containing these changes.

#### Bug Fixes

Provide a bulleted list of bug fixes and a reference to the PR(s) containing the changes.

### @nteract/connected-components ([publish-version-here])

#### Breaking Changes

Provide a bulleted list of breaking changes and a reference to the PR(s) containing those changes.

#### New Features

Provide a bulleted list of new features or improvements and a reference to the PR(s) containing these changes.

#### Bug Fixes

Provide a bulleted list of bug fixes and a reference to the PR(s) containing the changes.

### @nteract/core ([publish-version-here])

#### Breaking Changes

Provide a bulleted list of breaking changes and a reference to the PR(s) containing those changes.

#### New Features

Provide a bulleted list of new features or improvements and a reference to the PR(s) containing these changes.

#### Bug Fixes

Provide a bulleted list of bug fixes and a reference to the PR(s) containing the changes.

### @nteract/editor ([publish-version-here])

#### Breaking Changes

Provide a bulleted list of breaking changes and a reference to the PR(s) containing those changes.

#### New Features

Provide a bulleted list of new features or improvements and a reference to the PR(s) containing these changes.

#### Bug Fixes

Provide a bulleted list of bug fixes and a reference to the PR(s) containing the changes.

### @nteract/epics ([publish-version-here])

#### Breaking Changes

Provide a bulleted list of breaking changes and a reference to the PR(s) containing those changes.

#### New Features

Provide a bulleted list of new features or improvements and a reference to the PR(s) containing these changes.

#### Bug Fixes

Provide a bulleted list of bug fixes and a reference to the PR(s) containing the changes.

### @nteract/fixtures ([publish-version-here])

#### Breaking Changes

Provide a bulleted list of breaking changes and a reference to the PR(s) containing those changes.

#### New Features

Provide a bulleted list of new features or improvements and a reference to the PR(s) containing these changes.

#### Bug Fixes

Provide a bulleted list of bug fixes and a reference to the PR(s) containing the changes.

### @mybinder/host-cache ([publish-version-here])

#### Breaking Changes

Provide a bulleted list of breaking changes and a reference to the PR(s) containing those changes.

#### New Features

Provide a bulleted list of new features or improvements and a reference to the PR(s) containing these changes.

#### Bug Fixes

Provide a bulleted list of bug fixes and a reference to the PR(s) containing the changes.

### @nteract/markdown ([publish-version-here])

#### Breaking Changes

Provide a bulleted list of breaking changes and a reference to the PR(s) containing those changes.

#### New Features

Provide a bulleted list of new features or improvements and a reference to the PR(s) containing these changes.

#### Bug Fixes

Provide a bulleted list of bug fixes and a reference to the PR(s) containing the changes.

### @nteract/messaging ([publish-version-here])

#### Breaking Changes

Provide a bulleted list of breaking changes and a reference to the PR(s) containing those changes.

#### New Features

Provide a bulleted list of new features or improvements and a reference to the PR(s) containing these changes.

#### Bug Fixes

Provide a bulleted list of bug fixes and a reference to the PR(s) containing the changes.

### @nteract/monaco-editor ([publish-version-here])

#### Breaking Changes

Provide a bulleted list of breaking changes and a reference to the PR(s) containing those changes.

#### New Features

Provide a bulleted list of new features or improvements and a reference to the PR(s) containing these changes.

#### Bug Fixes

Provide a bulleted list of bug fixes and a reference to the PR(s) containing the changes.

### @nteract/mythic-configuration ([publish-version-here])

- New mythic package, will setup a transient in-memory configuration store per default. ([PR#5137](https://github.com/nteract/nteract/pull/5137))
- Dispatch the return value of `setConfigFile(<path>)` to make to load/write/watch a config file instead.
- To define configuration options, use `defineConfigOption(...)`:
    ```typescript
    import {defineConfigOption} from "@nteract/mythic-configuration";
    
    export const {
      selector: tabSize,
      action: setTabSize,
    } = defineConfigOption({
      label: "Tab Size",
      key: "codeMirror.tabSize",
      values: [
        {label: "2 Spaces", value: 2},
        {label: "3 Spaces", value: 3},
        {label: "4 Spaces", value: 4},
      ],
      defaultValue: 4,
    });
    ```
- You can then use the selector (e.g. `tabSize` above) to get the value from a store (e.g. `tabSize(store.getState())`).
- You can then alter the state by dispatching the result of the action function (e.g. `setTabSize` above, `store.dispatch(setTabSize(4))`).
- If you have a group of config options with a common prefix (e.g. `codemirror.<...>`), you can get a selector for the whole group with `createConfigCollection(...)`:
    ```typescript
    import {createConfigCollection} from "@nteract/mythic-configuration";
    
    const codeMirrorConfig = createConfigCollection({
      key: "codeMirror",
    });
    ```
    You can then do something like `codeMirrorConfig(store.getState())` to get something like
    ```javascript
    {
      tabSize: 4,
      // ... other options starting with `codemirror.`, potentially nested if more than one dot 
    }
    ```
- The state is stored under `__private__.configuration` in the store, but it shouldn't be neccessary to directly access it.
- To type the state/store you can use `HasPrivateConfigurationState`.

### @nteract/mythic-notifications ([publish-version-here])

#### Internal Changes

- Adapted to changes in the `myths` API (no functional change). ([PR#5106](https://github.com/nteract/nteract/pull/5106))

### @nteract/myths ([publish-version-here])

#### Breaking Changes

- Changed API somewhat, see `README.md` for details. ([PR#5106](https://github.com/nteract/nteract/pull/5106))

#### New Features

- See `README.md` for details. ([PR#5106](https://github.com/nteract/nteract/pull/5106))

### @nteract/notebook-app-component ([publish-version-here])

#### Breaking Changes

Provide a bulleted list of breaking changes and a reference to the PR(s) containing those changes.

#### New Features

Provide a bulleted list of new features or improvements and a reference to the PR(s) containing these changes.

#### Bug Fixes

Provide a bulleted list of bug fixes and a reference to the PR(s) containing the changes.

### @nteract/presentational-components ([publish-version-here])

#### Breaking Changes

Provide a bulleted list of breaking changes and a reference to the PR(s) containing those changes.

#### New Features

Provide a bulleted list of new features or improvements and a reference to the PR(s) containing these changes.

#### Bug Fixes

Provide a bulleted list of bug fixes and a reference to the PR(s) containing the changes.

### @nteract/reducers ([publish-version-here])

#### Breaking Changes

Provide a bulleted list of breaking changes and a reference to the PR(s) containing those changes.

#### New Features

Provide a bulleted list of new features or improvements and a reference to the PR(s) containing these changes.

#### Bug Fixes

Provide a bulleted list of bug fixes and a reference to the PR(s) containing the changes.

### rx-binder ([publish-version-here])

#### Breaking Changes

Provide a bulleted list of breaking changes and a reference to the PR(s) containing those changes.

#### New Features

Provide a bulleted list of new features or improvements and a reference to the PR(s) containing these changes.

#### Bug Fixes

Provide a bulleted list of bug fixes and a reference to the PR(s) containing the changes.

### rx-jupyter ([publish-version-here])

#### Breaking Changes

Provide a bulleted list of breaking changes and a reference to the PR(s) containing those changes.

#### New Features

Provide a bulleted list of new features or improvements and a reference to the PR(s) containing these changes.

#### Bug Fixes

Provide a bulleted list of bug fixes and a reference to the PR(s) containing the changes.

### @nteract/selectors ([publish-version-here])

#### Breaking Changes

Provide a bulleted list of breaking changes and a reference to the PR(s) containing those changes.

#### New Features

Provide a bulleted list of new features or improvements and a reference to the PR(s) containing these changes.

#### Bug Fixes

Provide a bulleted list of bug fixes and a reference to the PR(s) containing the changes.

### @nteract/stateful-components ([publish-version-here])

#### Breaking Changes

Provide a bulleted list of breaking changes and a reference to the PR(s) containing those changes.

#### New Features

Provide a bulleted list of new features or improvements and a reference to the PR(s) containing these changes.

#### Bug Fixes

Provide a bulleted list of bug fixes and a reference to the PR(s) containing the changes.

### @nteract/styles ([publish-version-here])

#### Breaking Changes

Provide a bulleted list of breaking changes and a reference to the PR(s) containing those changes.

#### New Features

Provide a bulleted list of new features or improvements and a reference to the PR(s) containing these changes.

#### Bug Fixes

Provide a bulleted list of bug fixes and a reference to the PR(s) containing the changes.

### @nteract/transform-model-debug ([publish-version-here])

#### Breaking Changes

Provide a bulleted list of breaking changes and a reference to the PR(s) containing those changes.

#### New Features

Provide a bulleted list of new features or improvements and a reference to the PR(s) containing these changes.

#### Bug Fixes

Provide a bulleted list of bug fixes and a reference to the PR(s) containing the changes.

### @nteract/types ([publish-version-here])

#### Breaking Changes

Provide a bulleted list of breaking changes and a reference to the PR(s) containing those changes.

#### New Features

Provide a bulleted list of new features or improvements and a reference to the PR(s) containing these changes.

#### Bug Fixes

Provide a bulleted list of bug fixes and a reference to the PR(s) containing the changes.

### @nteract/webpack-configurator ([publish-version-here])

#### Breaking Changes

Provide a bulleted list of breaking changes and a reference to the PR(s) containing those changes.

#### New Features

Provide a bulleted list of new features or improvements and a reference to the PR(s) containing these changes.

#### Bug Fixes

Provide a bulleted list of bug fixes and a reference to the PR(s) containing the changes.

## Acknowledgements

Provide a bulleted list of the GitHub handles of the contributors who have submitted PRs to the nteract repo for this release.
