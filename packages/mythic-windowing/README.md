# @nteract/mythic-windowing

This package implements a windowing system based on `electron`, using the `myths` framework.

## Installation

```
$ yarn add @nteract/mythic-windowing
```

```
$ npm install --save @nteract/mythic-windowing
```

## Usage

Initialize the package by including the `windowing` package in your store:

```javascript
import { windowing, setWindowingBackend, electronBackend } from "@nteract/mythic-windowing";
import { makeConfigureStore } from "@nteract/myths";

export const configureStore = makeConfigureStore({
  packages: [windowing],
});

store.dispatch(setWindowingBackend.create(electronBackend));

const electronReady$ = new Observable((observer) => {
  (app as any).on("ready", launchInfo => observer.next(launchInfo));
});

electronReady$
  .subscribe(
    () => store.dispatch(
      showWindow.create({
        id: "splash",
        kind: "splash",
        width: 565,
        height: 233,
        path: join(__dirname, "..", "static", "splash.html"),
      })
    ),
    (err) => console.error(err),
    () => store.dispatch(
      closeWindow.create("splash")
    ),
  );
```

## API

TBD

## Support

If you experience an issue while using this package or have a feature request, please file an issue on the [issue board](https://github.com/nteract/nteract/issues/new/choose) and add the `pkg:mythic-windowing` label.

## License

[BSD-3-Clause](https://choosealicense.com/licenses/bsd-3-clause/)
