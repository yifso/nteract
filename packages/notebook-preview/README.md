# @nteract/notebook-preview

This package contains a React component for rendering a static preview of a notebook given an Immutable representation of the notebook.

## Installation

```
$ yarn add @nteract/notebook-preview
```

```
$ npm install --save @nteract/notebook-preview
```

## Usage

The Redux reducer below shows how we can leverage the actions and action types in this package to create a reducer for managing the status of a save event.

```javascript
import NotebookPreview from "@nteract/notebook-preview";

export default () => <NotebookPreview notebook={immutableNotebook} />;
```

## Documentation

We're working on adding more documentation for this component. Stay tuned by watching this repository!

## Support

If you experience an issue while using this package or have a feature request, please file an issue on the [issue board](https://github.com/nteract/nteract/issues/new/choose) and add the `pkg:notebook-preview` label.

## License

[BSD-3-Clause](https://choosealicense.com/licenses/bsd-3-clause/)
