# @nteract/fs-kernels

This package contains functions for launching, getting stats on, and shutting down a Jupyter kernel.

## Installation

```
$ yarn add @nteract/fs-kernels
```

```
$ npm install --save @nteract/fs-kernels
```

## Usage

The example below shows how we can use this package to launch and connect to a new kernel and retrieve usage stats about the kernel's process.

```javascript
import Kernel from "@nteract/fs-kernels";

export default async () => {
  const kernelName = "python3";
  const kernel = new Kernel(kernelName);
  await kernel.launch();
  console.log(kernel.getUsage());
  await kernel.shutdown();
};
```

## Documentation

You can view the reference documentation for `@nteract/fs-kernels` in the [package docs](https://packages.nteract.io/modules/fs-kernels).

## Support

If you experience an issue while using this package or have a feature request, please file an issue on the [issue board](https://github.com/nteract/nteract/issues/new/choose) and add the `pkg:fs-kernels` label.

## License

[BSD-3-Clause](https://choosealicense.com/licenses/bsd-3-clause/)
