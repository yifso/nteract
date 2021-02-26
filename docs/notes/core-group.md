# Core

**Table of contents**
- /actions
- /core
- /epics
- /reducers
- /selectors
- /types

## /actions

The `@nteract/actions` package is part of the nteract core SDK. You'll likely be using this package in conjuction with other packages in the core SDK, like `@nteract/selectors` and `@nteract/epics`.

### What are actions?

Actions are plain JavaScript objects with a well-defined schema. They exist as part of the [Redux](https://redux.js.org/) universe. For general information about actions, you can check out the [Redux docs](https://redux.js.org/basics/actions/).

### What role do actions play in the nteract core SDK?

Every event that happens in a nteract-based UI will generally map to an action. For example, adding a new cell to a notebook or setting the Jupyter host that the nteract-based application is currently connected to. These actions are picked up by reducers and epics that implement the functionality related to the action.

### What are action creators?

Action creators are functions that take a specific set of parameters and return an action. For example, let's say we have an ExecuteCell action with the following schema.

```
{
    type: "EXECUTE_CELL";
    payload: {
        contentRef: ContentRef;
        id: CellId;
    }
}
```

The action creator for this action would look like this.

```js
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

### Where are the actions documented?

You can find a list of all the support actions [in the API docs for this package](https://packages.nteract.io/modules/actions.html).

### Using @nteract/actions in reducers

The `@nteract/actions` package expose a type interface for each action and a constant for each action type. You can use these exported properties as in the example below.

In the example below, `Save`, `SaveFulfilled`, and `SaveFailed` are type interfaces for the action. `SAVE`, `SAVE_FULFILLED`, and `SAVE_FAILED` are constant type definitions.

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

### Using @nteract/actions in React components

`@nteract/actions` can be used in conjunction with the `react-redux` package to dispatch actions from React components. For example, let's say you want to add a button to your user interface that will close the notebook when clicked. Here is how you would implement it.

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

### Using @nteract/actions in redux-observable epics

[Epics](https://redux-observable.js.org/docs/basics/Epics.html) are functions that take streams of Redux actions as inputs and return streams of Redux actions as outputs. You can use `@nteract/actions` in your custom epics to listen to actions dispatched from nteract-based applications and dispatch your own events.

In the example below, we listen to the `CloseNotebook` action and map it to a custom action.

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

@nteract/core is where the magic happens. The package, by itself, is nothing special. It encapsulates five other nteract packages that are designed to be used together.

- `@nteract/actions`
- `@nteract/reducers`
- `@nteract/epics`
- `@nteract/types`
- `@nteract/selectors`

Instead of installing and importing from each individual package above, it is recommend that you install `@nteract/core` and use each module like so.

```js
import { actions } from "@nteract/core"; // For actions
import { reducers } from "@nteract/core"; // For reducers
import { epics } from "@nteract/core"; // For epics
import { state } from "@nteract/core"; // For types
import { selectors } from "@nteract/core"; // For selectors
```

You can also import individually exported elements from `@nteract/core`. For example, if you want to use the `createContentRef` function from the `@nteract/types` package, you can import it like so from the core package.

```js
import { createContentRef } from "@nteract/core";
```

### Key Principles Behind @nteract/core

The `@nteract/core` package is heavily dependent on the underlying technologies powering nteract, namely Redux and RxJS. Each module exported from the core package is designed to work with the other. Here's how it all flows.

1. One of the key principles behind nteract is the existence of a client-side state model. This client-side model makes it easy to manage the state of the nteract client and to synchronize it with a back-end system. You can learn more about the state in the documentation for the `@nteract/types` package.
2. Redux actions are dispatched from nteract clients. Function creators and type definitions for these actions are exported from the `actions` module. For example, if we wanted to focus a particularly cell in a notebook, we can dispatch a `FocusCell` action.
3. Reducers are functions that make immutable changes to the state. Reducers take a base state and an action as inputs. Depending on the action, the base state will be copied and modified in a particular way. For example, a `FocusCell` action will update the `cellFocused` property for a particular content model in the state.
4. Epics bring RxJS and Redux together. They allow developers to implement functions that listen to actions and dispatch async requests or execute side-effects. For example, epics exported from the `epics` module handle cell execution targeting a Jupyter kernel and content fetching from a Jupyter server.
5. The state model has several useful properties, like the currently focused cell or the filepath of a content. The `selectors` module exports a set of selectors, functions that take an input state and return a particular state property.

### More Information

For more information on each component of the core SDK, visit the documentation pages for each module.

## /epics
Epics are functions that take a stream of Redux actions as inputs and return a stream of Redux actions as outputs. The best place to learn about epics is in [the documentation for redux-observable](https://redux-observable.js.org/docs/basics/Epics.html).

The nteract core SDK exports a set of epics that you can register in the middleware of your Redux store. When registered, these epics will be "active" and run when certain actions occur. If you don't want the functionality of a particular epic, you can unregister it from your Redux store.

Documentation on each of the epics is listed under the `@nteract/epics` tab by category.

### Comm Epics

Comm epics, more formally Communication Epics, are epics that support interacting with the
[Jupyter Messaging Protocol](https://jupyter-client.readthedocs.io/en/stable/messaging.html)
via comm messages.

A few years ago, Jupyter added a
[custom messaging](https://jupyter-client.readthedocs.io/en/stable/messaging.html#custom-messages)
system for developers to add their own objects with Front-end and Kernel-side components,
and allow them to communicate with each other. To do this, IPython adds a notion of a `Comm`,
which exists on both sides (Front end and Kernel), and can communicate in either direction.
As such, Comm messages are an arbitrary data exchange format built on top of the
Jupyter Messaging Protocol.

Comm messages are one-way communications to update comm state,
used for synchronizing widget state, or simply requesting actions of a comm's counterpart
(kernel-side request to front end or front-end request to kernel-side).

#### commListenEpic

The `commListenEpic` is activated whenever a new kernel is successfully launched.

This epic, `commListenEpic`:

- maps `comm_open` kernel messages to `COMM_OPEN` actions dispatched to the Redux store
- maps `comm_msg` actions to `COMM_MSG` Redux actions.

This epic also includes some custom logic to handle processing comm messages that are
specific to [ipywidgets](https://ipywidgets.readthedocs.io/en/latest/). See more below.

#### ipywidgetsModel

This epic listens to comm messages targeting ipywidget's `LinkModel` construct and updates
the nteract Redux state accordingly.

### Contents Epics

Contents epics handle content-related actions, such as fetching contents from a server, saving contents, and more.

#### updateContentEpic

This epic is triggered whenever a `ChangeContentName` action is dispatched. It sends a `PUT` request to the Jupyter server to update the filename of a particular piece of content.

#### fetchContentEpic

This epics is triggered whenever a `FetchContent` action is dispatched. It sends a `GET` request to the Jupyter server to retrieve the contents and metadata of a piece of content.

#### autoSaveCurrentContentEpic

This epic is triggered at a user-defined interval and saves the users contents by sending a network request to the Jupyter server.

#### saveContentEpic

This epic is triggered whenever a `Save` or `DownloadContent` action is triggered. When the action is `DownloadContent` it serializes the contents of the notebook and triggers a download event in the browser. When the action is `Save` it saves the contents of the notebook using the Jupyter server API.

#### saveAsContentEpic

This epic is triggered whenever a `SaveAs` action is triggered. It should be used when the file you are saving does not exist on the filesystem the Jupyter server is running in.

#### closeNotebookEpic

This epic is triggered whenever `CloseNotebook` action is dispatched. It maps the `CloseNotebook` action to `DisponseContent` and `KillKernel` actions.

### Execution Epics

#### executeAllCellsEpic

This epics maps an `ExecuteAllCells` action to multiple `ExecuteCell` actions for each cell.

#### executeFocusedCellEpic

This epic maps an `ExecuteFocusedCell` action to an `ExecuteCell` action.

#### lazyLaunchKernelEpic

This epic is triggered the first time an `ExecuteCell` action is dispatched. If there is no kernel connected to the notebook, this epic will launch a kernel.

#### executeCellEpic

This epic does one of two things when an `ExecuteCell` action is dispatched.

- If we are connected to a kernel, it immediately dispatches a `SendExecuteRequest` action.
- If there is no kernel connected, it stores the execution in the queue.

#### executeCellAfterKernelLaunchEpic

This epic works alongside the `lazyLaunchKernelEpic`. When a kernel has been successfully launched, it dispatches a `SendExecuteRequest` action for each execution that is stored in the execution queue.

#### sendExecuteRequestEpic

This epic listens to `SEND_EXECUTE_REQUESTS` and creates a new Observable that manages sending the execution request to the kernel and processing the responses. The Observable is unique per cell, so each cell will have its own Observable where requests and responses are processed.

#### updateDisplayEpic

This epic subsribes to messages coming in from a kernel when it is launched. If one of the messages is of the `update_display_data` message type, it dispatches an `UpdateDisplay` action.

#### sendInputReplyEpic

This epic processes sending response to `stdin` requests sent by the kernel. It listens to `SEND_INPUT_REPLY` actions which should be dispatched when a user provides a response to a `stdin` request in the UI.

### Kernel Epics

## /reducers

### Usage
The example below shows how we can use the functions within this package and those within `@nteract/actions` and `@nteract/types` to set the `isSaving` property on a notebook state.

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

### Usage

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
This package contains a collection of type definitions that are used throughout
nteract. You can use these types when interacting with kernelspecs, notebooks, and
hosts.


