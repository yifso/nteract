# @nteract/kernel-relay

This package provides a GraphQL API for managing communication between a Jupyter kernel and clients. The package allows users to launch kernels, subscribe to the status of a kernel, send Jupyter messages from a client to a kernel, and more.

## Installation

```
$ yarn add @nteract/kernel-relay
```

```
$ npm install --save @nteract/kernel-relay
```

## Usage

The example below showcases how to use the GraphQL API to get the status of a kernel.

```
# Query
query Kernel {
    status(kernelId: "my-kernel-id") {
        displayName,
        status
    }
}
# Response
{
    data: {
        kernel: {
            displayName: "Python 3"
            status: "idle"
        }
    }
}
```

## Documentation

We're working on adding more documentation for this component. Stay tuned by watching this repository!

## Support

If you experience an issue while using this package or have a feature request, please file an issue on the [issue board](https://github.com/nteract/nteract/issues/new/choose) and add the `pkg:kernel-relay` label.

## License

[BSD-3-Clause](https://choosealicense.com/licenses/bsd-3-clause/)
