# Group 4 (name tentative)

**Table of contents**
- /host-cache
- /rx-binder

## /host-cache
This package contains a provider component that allows you to connect to a Binder instance and access its context in all child components. To see this package in action, you can view the source for the [nteract play application](https://github.com/nteract/play).

### Installation

```
$ yarn add @nteract/host-cache
```

```
$ npm install --save @nteract/host-cache
```

### Usage

The example below shows how we can use the `Host` component within this package to connect to a Binder instance and display information about the connection.

```javascript
import { Host } from "@mybinder/host-cache";

export default () => {
  return (
    <Host
      repo="nteract/examples"
      gitRef="master"
      binderURL="https://mybinder.org"
    >
      <p>We've connected to a Binder instance within this context.</p>
      <p>
        But now we need to retrieve some information about the Binder context we
        are connected to.
      </p>
      <p>So let's use the "Host.Consumer" component!</p>
      <Host.Consumer>
        {host =>
          host ? (
            <pre>
              Endpoint: {host.endpoint}
              Token: {host.token}
            </pre>
          ) : null
        }
      </Host.Consumer>
    </Host>
  );
};
```

## /rx-binder

This package provides a set of functions for connecting to a remote instance provided by [Binder](https://mybinder.org/). This package will allow you to connect to a remote compute instance from your nteract application to execute code. To see this package in action, you can view the source code for the [nteract play app](https://github.com/nteract/play).

### Installation

```
$ yarn add rx-binder
```

```
$ npm install --save rx-binder
```

### Usage

```javascript
const { binder } = require("rx-binder");

binder({ repo: "nteract/vdom" }).subscribe(msg => console.log(msg));
> { phase: 'built',
  imageName: 'gcr.io/binder-prod/prod-v4-1-nteract-vdom:78fa2b549f67afc3525543b0bccfb08a9e06b006',
  message: 'Found built image, launching...\n' }
{ phase: 'launching', message: 'Launching server...\n' }
{ phase: 'ready',
  message: 'server running at https://hub.mybinder.org/user/nteract-vdom-r115e00y/\n',
  url: 'https://hub.mybinder.org/user/nteract-vdom-r115e00y/',
  token: 'tocwpFakeToken' }
```
