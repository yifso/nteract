# @nteract/fixtures

This package contains fixtures for immutable and string notebooks for use in nteract test suites.

## Installation

```
$ yarn add @nteract/fixtures
```

```
$ npm install --save @nteract/fixtures
```

## Usage

The example below shows how we can use this package to create a Redux store for a notebook with two code cells.

```javascript
import { fixtureStore } from "@nteract/fixtures";

export default () => {
  const testStore = fixtureStore({ codeCellCount: 2 });
  return testStore;
};
```

## Documentation

We're working on adding more documentation for this component. Stay tuned by watching this repository!

## Support

If you experience an issue while using this package or have a feature request, please file an issue on the [issue board](https://github.com/nteract/nteract/issues/new/choose) and add the `pkg:fixtures` label.

## License

[BSD-3-Clause](https://choosealicense.com/licenses/bsd-3-clause/)
