# @nteract/kernel-manager

This package contains functions for launching, getting stats on, and shutting down a Jupyter kernel.

## Installation

```
$ yarn add @nteract/kernel-manager
```

```
$ npm install --save @nteract/kernel-manager
```

## Usage

The example below shows how we can use this package to launch and connect to a new kernel and retrieve usage stats about the kernel's process.

```javascript
import Kernel from "@nteract/kernel-manager";

export default () => {
  const kernelName = "python3";
  const kernel = new Kernel("python3");
  console.log(kernel.getUsageStats());
};
```

## Documentation

You can view the reference documentation for `@nteract/kernel-manager` in the [package docs](https://packages.nteract.io/modules/kernel-manager).

## Support

If you experience an issue while using this package or have a feature request, please file an issue on the [issue board](https://github.com/nteract/nteract/issues/new/choose) and add the `pkg:kernel-manager` label.

## License

[BSD-3-Clause](https://choosealicense.com/licenses/bsd-3-clause/)
