# Binder

The **Binder** group contains the SDK packages for working with [Binder](https://mybinder.org) specifications. This group allows developers to leverage Binder APIs to provide features such as connecting to notebooks, notebook servers, as well as notebook instances.

**Table of contents**

[TOC]  

---

## /host-cache

This package contains a provider component for you to connect to a Binder instance and access its context in all child components. Examples of this package are in the source for the [nteract play application](https://github.com/nteract/play).

### Example

The example below shows how to use the `Host` component within this package to connect to a Binder instance and display information about the connection.

**Example:**

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

This package provides a set of functions for connecting to a remote instance provided by [Binder](https://mybinder.org/). This package allows you to connect to a remote compute instance from your nteract application to execute code. 

See an example of this package in the source code for the [nteract play app](https://github.com/nteract/play).

### Example

This content is still in development. For more information, reach out to the community on [GitHub](https://github.com/nteract).

**Example:**

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
