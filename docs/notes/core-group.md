# Core

**Table of contents**
- [/actions](#/actions)
  - [What are actions?](#What-are-actions?)
  - [What do actions do?](#What-do-actions-do?)
  - [Action creators](#Action-creators)
  - [Support action API](#Support-action-API)
  - [Examples](#Examples-of-/actions)
- [/core](#/core)
  - [Key principles](#Key-principles)
- [/epics](#/epics)
  - [Comm epics](#Comm-epics)
  - [Contents epics](#Contents-epics)
  - [Execution epics](#Execution-epics)
  - [Kernel epics](#Kernel-epics)
    - [Examples](#Examples-of-Kernel-epics)
- [/reducers](#/reducers)
- [/selectors](#/selectors)
- [/types](#/types)

## /actions

The `@nteract/actions` package is part of the nteract core SDK. This package most often works in conjuction with the `@nteract/selectors` and `@nteract/epics` packages in the core SDK.

### What are actions?

Actions are plain JavaScript objects with a well-defined schema. They are part of the [Redux](https://redux.js.org/) universe. For more information about actions, see [Redux docs](https://redux.js.org/basics/actions/).

### What do actions do?

In an nteract-based UI, every event maps to an action. Reducers and epics implement related functionalities after picking up these actions.  

**Examples of actions:**
- Adding a new cell to a notebook
- Setting the Jupyter host the nteract-based application connects to

### Action creators

Action creators are functions that take a specific set of parameters and return an action.  

**Example:**
The code below contains an ExecuteCell action with the following schema.

```javascript
{
    type: "EXECUTE_CELL";
    payload: {
        contentRef: ContentRef;
        id: CellId;
    }
}
```

This code block shows the action creator for this action.

```javascript
function executeCell({ contentRef, cellId }) {
    return {
       type: "EXECUTE_CELL";
        payload: {
            contentRef: ContentRef;
            id: CellId;
        }
    }
}
```

The `@nteract/actions` package exports a set of action creators for all the actions that nteract supports.

### Support action API

All support actions for this package are in the [API docs for @nteract/actions](https://packages.nteract.io/modules/actions.html).

### Examples of /actions

#### Using /actions in reducers

The `@nteract/actions` package expose a type interface for each action and a constant for each action type. See how these exported properties work in the example below.  

**Example:**
 `Save`, `SaveFulfilled`, and `SaveFailed` are type interfaces for the action. `SAVE`, `SAVE_FULFILLED`, and `SAVE_FAILED` are constant type definitions.

```js
import actions from "@nteract/actions";

export default function myReducer(
  state: MyState,
  action: actions.Save | actions.SaveFulfilled | actions.SaveFailed
) {
  switch (action.type) {
    case actions.SAVE:
      return { ...state, status: "saving" };
    case actions.SAVE_FULFILLED:
      return { ...state, status: "success" };
    case actions.SAVE_FAILED:
      return { ...state, status: "failed" };
    default:
      return state;
  }
}
```

#### Using @nteract/actions in React components

Use `@nteract/actions` in conjunction with the `react-redux` package to dispatch actions from React components.  

**Example:**
To add a button to your user interface that closes the notebook when clicked, follow the implementation below.

```js
import React from "react";
import actions from "@nteract/actions";
import { ContentRef } from "@nteract/types";

interface ComponentProps {
    contentRef: ContentRef;
}

class CloseButton extends React.Component {
  render() {
    return <button onClick={this.props.closeNotebook}>Close</button>;
  }
}

const mapDispatchToProps = (dispatch, ownProps) =? {
    const { contentRef } = ownProps;
    return {
        closeNotebook: dispatch(actions.closeNotebook({ contentRef }))
    };
}

export default connect(null, mapDispatchToProps)(CloseButton)
```

#### Using @nteract/actions in redux-observable epics

[Epics](https://redux-observable.js.org/docs/basics/Epics.html) are functions that take streams of Redux actions as inputs and return streams of Redux actions as outputs. To listen to actions dispatched from nteract-based applications and dispatch your own events, use `@nteract/actions` in your custom epics.

**Example:**
The code below shows the `CloseNotebook` action and maps it to a custom action.

```js
import { ofType } from "redux-observable";
import { mapTo } from "rxjs/operators";
import actions from "@nteract/actions"l

const mapCloseNotebook = action$ =>
  action$.pipe(
    ofType(actions.CLOSE_NOTEBOOK),
    mapTo({
      type: "MY_CLOSE_NOTEBOOK",
      payload: { message: "Notebook closed. " }
    })
  );
```

## /core

@nteract/core on its own encapsulates the five other nteract packages.  

- `@nteract/actions`
- `@nteract/epics`
- `@nteract/reducers`
- `@nteract/selectors`
- `@nteract/types`

Install `@nteract/core` and use each module instead of installing and importing from each individual package. The following code example shows standard use cases.

```js
import { actions } from "@nteract/core"; // For actions
import { reducers } from "@nteract/core"; // For reducers
import { epics } from "@nteract/core"; // For epics
import { state } from "@nteract/core"; // For types
import { selectors } from "@nteract/core"; // For selectors
```

You can also import individually exported elements from `@nteract/core`.  

**Example:**
To use the `createContentRef` function from the `@nteract/types` package, use the code below to import it from the core package.

```js
import { createContentRef } from "@nteract/core";
```

### Key principles

The `@nteract/core` package is heavily dependent Redux and RxJS. These two technologies power nteract. Each module exported from the core package works with the other by design.  

1. The client-side state model is one of the key principles behind nteract. This client-side model makes it easy to manage the state of the nteract client and to synchronize it with a back-end system. Learn more about the state in the `@nteract/types` package documentation.
2. nteract clients dispatch Redux actions. The `actions` module exports function creators and type definitions for these actions.
  - **Example:**
    To focus a particular cell in a notebook, dispatch a `FocusCell` action.
3. Reducers are functions that make immutable changes to the state. Reducers take a base state and an action as inputs. Depending on the action, the functions copy and modify the base state in a particular way.
  - **Example:**
    A `FocusCell` action updates the `cellFocused` property for a particular content model in the state.
4. Epics bring RxJS and Redux together. They allow developers to implement functions that listen to actions and dispatch async requests or execute side-effects.
  - **Example:**
    Epics exported from the `epics` module handle cell execution targeting a Jupyter kernel and content fetching from a Jupyter server.
5. The state model has useful properties such as indicating the currently focused cell or the filepath of a content. The `selectors` module exports a set of selectors. These are functions that take an input state and return a particular state property.


## /epics
Epics are functions that take a stream of Redux actions as inputs and return a stream of Redux actions as outputs. Learn about epics in the [documentation for redux-observable](https://redux-observable.js.org/docs/basics/Epics.html).

The nteract core SDK exports a set of epics. Register these in the middleware of your Redux store. When registered, these epics are active and run when certain actions occur. To remove the functionality of a particular epic, unregister it from your Redux store.

### Comm epics

Comm epics, more formally Communication Epics, are epics that support interacting with the
[Jupyter Messaging Protocol](https://jupyter-client.readthedocs.io/en/stable/messaging.html)
via comm messages.

In the past, Jupyter added a
[custom messaging](https://jupyter-client.readthedocs.io/en/stable/messaging.html#custom-messages)
system for developers to add their own objects with Front-end and Kernel-side components, and allowed them to communicate with each other.  

To do this, IPython adds a notion of a `Comm`. This exists on both Front-end and Kernel-side components and communicates in either direction. Comm messages are an arbitrary data exchange format built on top of the [Jupyter Messaging Protocol](https://jupyter-client.readthedocs.io/en/stable/messaging.html).

Comm messages are one-way communications for updating comm state,
synchronizing widget state, or requesting actions of a comm's counterpart.
In requesting actions, it works as a kernel-side request to front-end or front-end request to kernel-side.

#### commListenEpic

The `commListenEpic` activates whenever launching a new kernel successfully.

`commListenEpic` maps:

- `comm_open` kernel messages to `COMM_OPEN` actions dispatched to the Redux store
- `comm_msg` actions to `COMM_MSG` Redux actions

This epic also includes custom logic to handle processing comm messages specific to [ipywidgets](https://ipywidgets.readthedocs.io/en/latest/). See more at [ipywidgetsModel](#ipywidgetsModel).

#### ipywidgetsModel

This epic listens to comm messages targeting ipywidget's `LinkModel` construct and updates
the nteract Redux state accordingly.

### Contents epics

Contents epics handle content-related actions such as fetching contents from a server, saving contents, and more.

#### updateContentEpic

This epic triggers whenever dispatching a `ChangeContentName` action. It sends a `PUT` request to the Jupyter server to update the filename of a particular piece of content.

#### fetchContentEpic

This epic triggers whenever dispatching a `FetchContent` action. It sends a `GET` request to the Jupyter server to retrieve the contents and metadata of a piece of content.

#### autoSaveCurrentContentEpic

This epic triggers at a user-defined interval and saves the user's contents by sending a network request to the Jupyter server.

#### saveContentEpic

This epic triggers whenever activating a `Save` or `DownloadContent` action. When the action is `DownloadContent`, it serializes the contents of the notebook and triggers a download event in the browser. When the action is `Save`, it saves the contents of the notebook using the Jupyter server API.

#### saveAsContentEpic

This epic triggers whenever activating a `SaveAs` action. Use this epic when the file you are saving does not exist on the filesystem the Jupyter server is running in.

#### closeNotebookEpic

This epic triggers whenever dispatching a `CloseNotebook` action. It maps the `CloseNotebook` action to `DisponseContent` and `KillKernel` actions.

### Execution epics

#### executeAllCellsEpic

This epics maps an `ExecuteAllCells` action to multiple `ExecuteCell` actions for each cell.

#### executeFocusedCellEpic

This epic maps an `ExecuteFocusedCell` action to an `ExecuteCell` action.

#### lazyLaunchKernelEpic

This epic triggers when dispatching an `ExecuteCell` action for the first time. If there is no kernel connected to the notebook, this epic launches a kernel.

#### executeCellEpic

This epic does one of following two things when dispatching an `ExecuteCell` action.

- If connected to a kernel, it immediately dispatches a `SendExecuteRequest` action.
- If there is no kernel connected, it stores the execution in the queue.

#### executeCellAfterKernelLaunchEpic

This epic works alongside the `lazyLaunchKernelEpic`. When launching a kernel successfully , it dispatches a `SendExecuteRequest` action for each execution stored in the execution queue.

#### sendExecuteRequestEpic

This epic listens to `SEND_EXECUTE_REQUESTS` and creates a new Observable. This Observable  manages sending the execution request to the kernel and processing the responses. The Observable is unique per cell. Each cell has its own Observable where requests and responses are processed.

#### updateDisplayEpic

This epic subscribes to messages coming in from a kernel when launched. If one of the messages is of the `update_display_data` message type, it dispatches an `UpdateDisplay` action.

#### sendInputReplyEpic

This epic responds to `stdin` kernel requests. This epic listens and processes `SEND_INPUT_REPLY` actions when a user responds to a `stdin` prompt in the UI.

**Example:**
The Python code below is an example of this activity in a Python kernel. For the `sendInputReplyEpic`, this epic processes user input to the kernel.

```python
message = input("Type a message:")
```

### Kernel epics
These epics activate after launching kernel actions. This is helpful for managing actions such as launching, restarting, and shutting down kernels. These epics allow users to confirm kernels and connect to them for code.

#### Examples of Kernel epics
The following code samples show how this epic acts in response to kernel contexts.

**Example:**
The code below sets the execution state after launching a kernel.

```javascript
export const watchExecutionStateEpic = (
  action$: Observable<
    actions.NewKernelAction | actions.KillKernelSuccessful
  >
) =>
  action$.pipe(
    ofType(actions.LAUNCH_KERNEL_SUCCESSFUL),
    switchMap(
      (action: actions.NewKernelAction | actions.KillKernelSuccessful) =>
        (action as actions.NewKernelAction).payload.kernel.channels.pipe(
          filter((msg: JupyterMessage) => msg.header.msg_type === "status"),
          map((msg: JupyterMessage) =>
            actions.setExecutionState({
              kernelStatus: msg.content.execution_state,
              kernelRef: (action as actions.NewKernelAction).payload.kernelRef
            })
          ),
          takeUntil(
            action$.pipe(
              ofType(actions.KILL_KERNEL_SUCCESSFUL),
              filter(
                (
                  killAction:
                    | actions.KillKernelSuccessful
                    | actions.NewKernelAction
                ) => killAction.payload.kernelRef === action.payload.kernelRef
              )
            )
          ),
          catchError((error: Error) => {
            return of(
              actions.executeFailed({
                error: new Error(
                  "The WebSocket connection has unexpectedly disconnected."
                ),
                code: errors.EXEC_WEBSOCKET_ERROR,
                contentRef: (action as actions.NewKernelAction).payload.contentRef
              })
            );
          })
        )
    )
  );
```

**Example:**
Below is a code example showing how to get information about a newly launched kernel.

```javascript
export const acquireKernelInfoEpic = (
  action$: Observable<actions.NewKernelAction>,
  state$: StateObservable<AppState>
) =>
  action$.pipe(
    ofType(actions.LAUNCH_KERNEL_SUCCESSFUL),
    switchMap((action: actions.NewKernelAction) => {
      const {
        payload: {
          kernel: { channels, kernelSpecName },
          kernelRef,
          contentRef
        }
      } = action;
      return acquireKernelInfo(
        channels,
        kernelRef,
        contentRef,
        state$.value,
        kernelSpecName
      );
    })
  );
```

**Example:**
The code below shows the kernel epic handling notebook content. This epic supports launching a kernel via the Jupyter server.

```javascript
export const launchKernelWhenNotebookSetEpic = (
  action$: Observable<actions.FetchContentFulfilled>,
  state$: any
) =>
  action$.pipe(
    ofType(actions.FETCH_CONTENT_FULFILLED),
    mergeMap((action: actions.FetchContentFulfilled) => {
      const state: AppState = state$.value;

      const contentRef = action.payload.contentRef;

      const content = selectors.content(state, { contentRef });

      if (
        !content ||
        content.type !== "notebook" ||
        content.model.type !== "notebook"
      ) {
        // This epic only handles notebook content
        return EMPTY;
      }

      /**
       * Avoid relaunching kernels for notebooks that have already
       * launched their content.
       */
      if (content.model.kernelRef) {
        const kernel = selectors.kernel(state, {
          kernelRef: content.model.kernelRef
        });
        if (kernel && kernel.channels) {
          return EMPTY;
        }
      }
      const filepath = content.filepath;
      const notebook = content.model.notebook;

      const { cwd, kernelSpecName } = extractNewKernel(filepath, notebook);

      return of(
        actions.launchKernelByName({
          kernelSpecName,
          cwd,
          kernelRef: action.payload.kernelRef,
          selectNextKernel: true,
          contentRef: action.payload.contentRef
        })
      );
    })
  );
```

**Example:**
This epic in the example below restarts a Jupyter kernel in a local scenario. In this case, a restart requires killing the existing kernel process and starting a new one.

```javascript
export const restartKernelEpic = (
  action$: Observable<actions.RestartKernel | actions.NewKernelAction>,
  state$: any
) =>
  action$.pipe(
    ofType(actions.RESTART_KERNEL),
    concatMap((action: actions.RestartKernel | actions.NewKernelAction) => {
      const state = state$.value;

      const oldKernelRef = selectors.kernelRefByContentRef(state$.value, {
        contentRef: action.payload.contentRef
      });

      if (!oldKernelRef) {
        return of(
          sendNotification.create({
            title: "Failure to Restart",
            message: "Unable to restart kernel, please select a new kernel.",
            level: "error"
          })
        );
      }

      const oldKernel = selectors.kernel(state, { kernelRef: oldKernelRef });

      if (oldKernel && oldKernel.type === "websocket") {
        return EMPTY;
      }

      if (!oldKernelRef || !oldKernel) {
        return of(
          sendNotification.create({
            title: "Failure to Restart",
            message: "Unable to restart kernel, please select a new kernel.",
            level: "error"
          })
        );
      }

      const newKernelRef = createKernelRef();
      const initiatingContentRef = action.payload.contentRef;
      const successNotification = sendNotification.create({
        title: "Kernel Restarting...",
        message: `Kernel ${oldKernel.kernelSpecName ||
          "unknown"} is restarting.`,
        level: "success"
      });

      const kill = actions.killKernel({
        restarting: true,
        kernelRef: oldKernelRef
      });

      const relaunch = actions.launchKernelByName({
        kernelSpecName: oldKernel.kernelSpecName ?? undefined,
        cwd: oldKernel.cwd,
        kernelRef: newKernelRef,
        selectNextKernel: true,
        contentRef: initiatingContentRef
      });

      const awaitKernelReady = action$.pipe(
        ofType(actions.LAUNCH_KERNEL_SUCCESSFUL),
        filter(
          (action: actions.NewKernelAction | actions.RestartKernel) =>
            action.payload.kernelRef === newKernelRef
        ),
        take(1),
        timeout(60000), // If kernel doesn't come up within this interval we will abort follow-on actions.
        concatMap(() => {
          const restartSuccess = actions.restartKernelSuccessful({
            kernelRef: newKernelRef,
            contentRef: initiatingContentRef
          });

          if (
            (action as actions.RestartKernel).payload.outputHandling ===
            "Run All"
          ) {
            return of(
              restartSuccess,
              actions.executeAllCells({ contentRef: initiatingContentRef })
            );
          } else {
            return of(restartSuccess);
          }
        }),
        catchError(error => {
          return of(
            actions.restartKernelFailed({
              error,
              kernelRef: newKernelRef,
              contentRef: initiatingContentRef
            })
          );
        })
      );

      return merge(of(kill, relaunch, successNotification), awaitKernelReady);
    })
  );
```

## /reducers
The package contains a set of Redux reducers for nteract applications. They describe the change in the application's state when the store receives actions.

### Example
The code below shows how to use the functions to set the `isSaving` property on a notebook state.

```javascript
import * as reducers from "@nteract/reducers";
import * as actions from "@nteract/actions";
import * as state from "@nteract/types";

export default () => {
  const originalState = state.makeAppRecord({
    isSaving: true
  });
  reducers.app(originalState, actions.saveFulfilled({}));
};
```

## /selectors
This package provides a set of seletors and functions for you to extract important information from the state of your nteract application. View the AppState type to see a full set of data stored in the application state. For reference, this package extracts that information.

### Example
The code below is an example of using the package.

**Example:**
```javascript
import { modalType, currentTheme } from "@nteract/selectors";

const state = {
  config: {
    theme: "dark"
  },
  core: {
    entities: {
      modals: {
        modalType: "ABOUT"
      }
    }
  }
};

const theme = currentTheme(state);
const currentModal = modalType(state);
console.log(`Rendering ${currentModal} modal using ${theme} theme.`);
> Rendering ABOUT modal using dark theme.
```

## /types
This package contains a collection of type definitions throughout nteract. Use these types when interacting with kernelspecs, notebooks, and hosts. View the complete list on the [Package types](https://packages.nteract.io/modules/types.html) page of the nteract website.


