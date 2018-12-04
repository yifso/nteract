# @nteract/connected-components

This package contains React components for rendering navigation menus and modals in nteract applications. To see this package in action, you can view the source code for the [nteract-on-Jupyter](https://github.com/nteract/nteract/tree/master/applications/jupyter-extension) application.

## Installation

```
$ yarn add @nteract/connected-components
```

```
$ npm install --save @nteract/connected-components
```

## Usage

The example below shows we can use the `ModalController` component within this package to render an about modal.

```javascript
import { ModalController, MODAL_TYPES } from "@nteract/connected-components";

export default () => {
  return <ModalController modalType={MODAL_TYPES.ABOUT} />;
};
```

## Documentation

We're working on adding more documentation for this component. Stay tuned by watching this repository!

## Support

If you experience an issue while using this package or have a feature request, please file an issue on the [issue board](https://github.com/nteract/nteract/issues/new/choose) and add the `pkg:connected-components` label.

## License

[BSD-3-Clause](https://choosealicense.com/licenses/bsd-3-clause/)
