# Other (name tentative)

**Table of contents**
- [/connected-components](#/connected-components)
- [/fixtures](#/fixtures)

## /connected-components
This package contains React components for rendering navigation menus and modals in nteract applications. Find examples of the package in  the source code for the [nteract-on-Jupyter](https://github.com/nteract/nteract/tree/master/applications/jupyter-extension) application.

### Example

The example below shows to use the `ModalController` component within this package to render an about modal.

**Example:**

```javascript
import { ModalController, MODAL_TYPES } from "@nteract/connected-components";

export default () => {
  return <ModalController modalType={MODAL_TYPES.ABOUT} />;
};
```

## /fixtures

This package contains fixtures for immutable and string notebooks for use in nteract test suites.

### Example

The example below shows how to use this package to create a Redux store for a notebook with two code cells.

**Example:**

```javascript
import { fixtureStore } from "@nteract/fixtures";

export default () => {
  const testStore = fixtureStore({ codeCellCount: 2 });
  return testStore;
};
```
