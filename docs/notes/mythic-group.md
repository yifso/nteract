# Mythic

**Table of contents**
- [/mythic-configuration](#/mythic-configuration)
  - [Examples](#Examples-of-/mythic-configuration)
  - [API](#/API-for-/mythic-configuration)
- [/mythic-multiselect](#/mythic-multiselect)
  - [Examples](#/Examples-of-/mythic-multiselect)
  - [API](#/API-for-/mythic-multiselect)
- [/mythic-notifications](#/mythic-notifications)
  - [Examples](#/Examples-of-/mythic-notifications)
  - [API](#/API-for-/mythic-notifications)
- [/mythic-windowing](#/mythic-windowing)
  - [Examples](#/Examples-of-/mythic-windowing)
  - [API](#/API-for-/mythic-windowing)
- [/myths](#/myths)
  - [Examples](#/Examples-of-/myths)
    - [MythicPackage](#/MythicPackage)
    - [Myth](#/Myth)
    - [Action](#/Action)
    - [Store](#/Store)
  - [Definition of epics](#/Definition-of-epics)
  - [Testing](#Testing)

## /mythic-configuration
The /mythic-configuration package is for [insert text here]

### Examples of /mythic-configuration

Initialize the package by including the `configuration` package. Memory saves the configuration by default.

**Example:**
To use a config file, dispatch a `setConfigFile` action following the code below.

```javascript
import { configuration } from "@nteract/mythic-configuration";
import { makeConfigureStore } from "@nteract/myths";

export const configureStore = makeConfigureStore({
  packages: [configuration],
});

store.dispatch(setConfigFile("/etc/app.conf"));
```

The package saves any configuration options to that file and tracks it. Any additional options load as the file changes.

Configuration options are available after initialization.

**Example:**

```javascript
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

const currentValue = tabSize(store.getState());

store.dispatch(setTabSize(2));
```

To get an object from all config options with a common prefix, use `createConfigCollection`.

**Example:**

```javascript
const codeMirrorConfig = createConfigCollection({
  key: "codeMirror",
});
```
Now `codeMirrorConfig()` will give you e.g. with above option `{tabSize: 4}`, with default values properly handled. 

You can also get all options:
```javascript
import { allConfigOptions } from "@nteract/mythic-configuration";

const options = allConfigOptions();
const optionsWithCurrentValues = allConfigOptions(store.getState());
```

In order to change the key of a config option, deprecate the old key with the following code. This changes the old key to the new key, unless the new key already has a value.

**Example:**

```javascript
createDeprecatedConfigOption({
  key: "cursorBlinkRate",
  changeTo: (value: number) => ({
    "codeMirror.cursorBlinkRate": value,
  }),
});
```

### API for /mythic-configuration
The API for this package is [insert text here]

**Example:**

```typescript
import { RootState } from "@nteract/myths";
import { ConfigurationState, setConfigAtKey } from "@nteract/mythic-configuration";

export interface ConfigurationOptionDefinition<TYPE = any> {
  label: string;
  key: string;
  defaultValue: TYPE;
  valuesFrom?: string;
  values?: Array<{
    label: string;
    value: TYPE;
  }>;
}

export interface ConfigurationOption<TYPE = any>
  extends ConfigurationOptionDefinition<TYPE> {

  value?: TYPE;
  selector: (state: HasPrivateConfigurationState) => TYPE;
  action: (value: TYPE) => typeof setConfigAtKey.action;
}

export type HasPrivateConfigurationState =
  RootState<"configuration", ConfigurationState>;
```

## /mythic-multiselect
This package implements a simple method of keeping track of multiple selected cells using the `myths` framework.

### Examples of /mythic-multiselect

Initialize the package by including the `notifications` package in your store and rendering the `<NotificationsRoot/>`:

**Example:**

```javascript
import {
  multiselect,
  selectCell,
  unselectCell,
  clearSelectedCells,
} from "@nteract/mythic-multiselect";

store.dispatch(
  selectCell({
    contentRef: "content",
    id: "cellID",
  })
);
```

### API for /mythic-multiselect
[insert text here]

```typescript
```

## /mythic-notifications
This package implements a notification system based on `blueprintjs`, using the `myths` framework.

### Examples of /mythic-notifications

Initialize the package by including the `notifications` package in your store and rendering the `<NotificationsRoot/>`:

**Example:**

```javascript
import { notifications, NotificationRoot } from "@nteract/mythic-notifications";
import { makeConfigureStore } from "@nteract/myths";

export const configureStore = makeConfigureStore({
  packages: [notifications],
});

export const App = () =>
    <>
      {/* ... */}
      <NotificationRoot darkTheme={false} />
    </>
```

Then dispatch actions made by `sendNotification.create`:

```javascript
import { sendNotification } from "@nteract/mythic-notifications";

store.dispatch(sendNotification.create({
  title: "Hello World!",
  message: <em>Hi out there!</em>,
  level: "info",
}));
```

### API for /mythic-notifications

```typescript
import { IconName } from "@blueprintjs/core";

export interface NotificationMessage {
  key?: string;
  icon?: IconName;
  title?: string;
  message: string | JSX.Element;
  level: "error" | "warning" | "info" | "success" | "in-progress";
  action?: {
    icon?: IconName;
    label: string;
    callback: () => void;
  };
}
```

## /mythic-windowing
This package implements a windowing system based on `electron`, using the `myths` framework.

### Examples of /mythic-windowing

Initialize the package by including the `windowing` package in your store:

**Example:**

```javascript
import { windowing, setWindowingBackend, electronBackend } from "@nteract/mythic-windowing";
import { makeConfigureStore } from "@nteract/myths";

export const configureStore = makeConfigureStore({
  packages: [windowing],
});

store.dispatch(setWindowingBackend.create(electronBackend));

const electronReady$ = new Observable((observer) => {
  (app as any).on("ready", launchInfo => observer.next(launchInfo));
});

electronReady$
  .subscribe(
    () => store.dispatch(
      showWindow.create({
        id: "splash",
        kind: "splash",
        width: 565,
        height: 233,
        path: join(__dirname, "..", "static", "splash.html"),
      })
    ),
    (err) => console.error(err),
    () => store.dispatch(
      closeWindow.create("splash")
    ),
  );
```

### API for /mythic-windowing

[insert text here]

## /myths

The `myths` framework allows for integrating sets of closely related actions, reducers and epics. Myths allow close relationships where DRY and dependencies are minimized. Myths provide structured way to avoid boilerplate code.

Myths build on top of the [Redux](https://react-redux.js.org/) and
[RxJS](https://redux.js.org/) libraries.

Redux helps to maintain the application state. In Redux, actions and reducers provide predictable state management. The state changesd only when dispatching an action to a reducer.

In [Redux-Observable](https://redux-observable.js.org/), an epic is a function that takes in a stream of actions and returns a stream of actions.

### Examples of /myths
[insert text here]

#### MythicPackage

Create a `MythicPackage` with a name, a type for its private state, and the initial state.

The example below creates a `MythicPackage` named `"iCanAdd"` which uses the `number`
type for its private state `sum` and an initial state of `sum` as `0`:

**Example:**

```typescript
export const iCanAdd = createMythicPackage("iCanAdd")<
  {
    sum: number;
  }
>({
  initialState: {
    sum: 0,
  },
});
```

#### Myth

Next, use the `MythicPackage` to create a `Myth` with a name, a type for its payload, and optionally a reducer operating on its package's private state.

In example below, the `MythicPackage` named `iCanAdd` creates a `Myth` named `"addToSum"`.

**Example:**

```typescript
export const addToSum =
  iCanAdd.createMyth("addToSum")<number>({
    reduce: (state, action) =>
      state.set("sum", state.get("sum") + action.payload),
  });
```

A package can have any number of myths.

#### Action

To create an action based on a myth, use its `create` function and dispatch this action normally.

**Example:**

```typescript
store.dispatch(addToSum.create(8));
```

#### Store

A set of mythic packages yields a store. This store has all the appropriate reducers and epics in place.

**Example:**

```typescript
type NonPrivateState = { foo: string };
const configureStore = makeConfigureStore<NonPrivateState>()({
  packages: [
    iCanAdd,
  ],
});
export const store = configureStore({ foo: "bar" });
```

### Definition of epics

Define epics using two different shorthand methods.

**Example:**

```typescript
export const addToSum =
  iCanAdd.createMyth("addToSum")<number>({

    reduce: (state, action) =>
      state.set("sum", state.get("sum") + action.payload),

    thenDispatch: [
      (action, state) =>
        state.get("sum") - action.payload < 100 && 100 <= state.get("sum")
          ? of(sendNotification.create({message: "Just passed 100!"}))
          : EMPTY,
    ],

    andAlso: [
      {
        // Halve the sum every time an error action happens
        when: action => action.error ?? false,
        dispatch: (action, state, addToSum_) =>
          of(addToSum_.create(-state.get("sum") / 2)),
      },
    ],

  });
```

The first method uses `thenDispatch: []` to define actions. which should be dispatched when actions of the defined type are dispatched. The second method uses `andAlso: []` to generate actions based on a custom predicate.

Defining the type means the type is not available for reference yet. The type passes as the third argument to the dispatch function.
 
### Testing

To test the actions of a mythic package, use the `testMarbles(...)` method. 

> NOTE: This only tests the epics without evaluating reducers.