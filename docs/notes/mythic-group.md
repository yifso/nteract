# Mythic

**Table of contents**
- /mythic-configuration
- /mythic-multiselect
- /mythic-notifications
- /mythic-windowing
- /myths

## /mythic-configuration

### Usage

Initialize the package by including the `configuration` package. Per default it will save the configuration in memory.
If you would like to use a config file, you can dispatch a `setConfigFile` action:

```javascript
import { configuration } from "@nteract/mythic-configuration";
import { makeConfigureStore } from "@nteract/myths";

export const configureStore = makeConfigureStore({
  packages: [configuration],
});

store.dispatch(setConfigFile("/etc/app.conf"));
```

The package will use that file to save any configuration options. The file is also watched and loaded when it changes.

After this initialisation, you can then work with configuration options:

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

To get an object from all config options with a common prefix, use `createConfigCollection`:
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

In case you want to change the key of a config option, you can deprecate the old key:
```javascript
createDeprecatedConfigOption({
  key: "cursorBlinkRate",
  changeTo: (value: number) => ({
    "codeMirror.cursorBlinkRate": value,
  }),
});
```

This will change the old key to the new key, unless the new key already has a value.

### API

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

### Installation

```
$ yarn add @nteract/mythic-multiselect
```

```
$ npm install --save @nteract/mythic-multiselect
```

### Usage

Initialize the package by including the `notifications` package in your store and rendering the `<NotificationsRoot/>`:

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

### API

```typescript
```

## /mythic-notifications
This package implements a notification system based on `blueprintjs`, using the `myths` framework.

### Installation

```
$ yarn add @nteract/mythic-notifications
```

```
$ npm install --save @nteract/mythic-notifications
```

### Usage

Initialize the package by including the `notifications` package in your store and rendering the `<NotificationsRoot/>`:

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

### API

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

### Installation

```
$ yarn add @nteract/mythic-windowing
```

```
$ npm install --save @nteract/mythic-windowing
```

### Usage

Initialize the package by including the `windowing` package in your store:

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

### API

TBD

## /myths

**This is a pre-alpha level package; interfaces are not stable yet!**

The `myths` framework allows for integrating sets of closely related actions, reducers and epics. Myths allow
close relationships where DRY and dependencies are minimized. Therefore, Myths provide for a structured way
to avoid boilerplate.

Myths build on top of the [Redux](https://react-redux.js.org/) and
[RxJS](https://redux.js.org/) libraries that are used elsewhere in the nteract core SDK.
As a refresher, Redux helps you maintain application state. In Redux, actions and reducers provide
predictable state management. The state may only be changed by dispatching an action to a reducer.
In [Redux-Observable](https://redux-observable.js.org/), an epic
is a function that takes in a stream of actions and returns
a stream of actions.

### Installation

```
$ yarn add myths
```

```
$ npm install --save myths
```

### Usage

#### MythicPackage

First, create a `MythicPackage` with a name, a type for its private state, and the initial state.
As an example, the following creates a `MythicPackage` named `"iCanAdd"` which uses the `number`
type for its private state `sum` and an initial state of `sum` as `0`:

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

Next, you can the use the `MythicPackage` to create a `Myth` with a name, a type for its payload, and optionally a reducer
operating on its package's private state. In this example, the `MythicPackage` named `iCanAdd` creates a `Myth`
named `"addToSum"`:

```typescript
export const addToSum =
  iCanAdd.createMyth("addToSum")<number>({
    reduce: (state, action) =>
      state.set("sum", state.get("sum") + action.payload),
  });
```

A package can have any number of myths.

#### Action

To create an action based on a myth, use its `create` function. You can then dispatch this action normally:

```typescript
store.dispatch(addToSum.create(8));
```

#### Store

You get a store from a set of mythic packages, which has all the appropriate reducers and epics already in place:

```typescript
type NonPrivateState = { foo: string };
const configureStore = makeConfigureStore<NonPrivateState>()({
  packages: [
    iCanAdd,
  ],
});
export const store = configureStore({ foo: "bar" });
```

### Epics: their definition

Epics can be defined using two different shorthand methods:

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

The first method uses `thenDispatch: []` to define actions which should be dispatched when actions of the defined type
are dispatched, and the second method uses `andAlso: []` to generate actions based on a custom predicate.
Since the type being defined is not available for reference yet, it is passed as third argument to the dispatch function.
 
### Testing

To test the actions of a mythic package, you can use the `testMarbles(...)` method. Note that this only tests the epics,
without evaluating reducers.