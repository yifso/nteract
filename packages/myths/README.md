# myths (currently: @nteract/myths, TBC)

**This is a pre-alpha level package; interfaces are not stable yet!**

This framework allows for integrating sets of closely related actions, reducers and epics while mainting high DRY and minimizing dependencies. It provides for a structured way to avoid boilerplate. 

## Installation

```
$ yarn add myths
```

```
$ npm install --save myths
```

## Usage

First, create a `MythicPackage` with a name, a type for its private state, and the initial state:

```typescript
export const iCanAdd = createMythicPackage("iCanAdd")<
  {
    sum: number;
  }
>({
  initialState: {
    sum: 0,
  },
});
```

You can the use the package to create a `Myth`, again with a name, a type for its payload and optionally a reducer operating on its package's private state:

```typescript
export const addToSum =
  iCanAdd.createMyth("addToSum")<number>({
    reduce: (state, action) =>
      state.set("sum", state.get("sum") + action.payload),
  });
```

A package can have any number of myths. To create an action based on a myth, use its create function. You can then dispatch this action normally:

```typescript
store.dispatch(addToSum.create(8));
```

You get a store from a set of mythic packages, which has all the appropriate reducers and epics already in place:

```typescript
type NonPrivateState = { foo: string };
const configureStore = makeConfigureStore<NonPrivateState>()({
  packages: [
    iCanAdd,
  ],
});
export const store = configureStore({ foo: "bar" });
```

## Documentation

We're working on adding more documentation for this component. Stay tuned by watching this repository!

## Support

If you experience an issue while using this package or have a feature request, please file an issue on the [issue board](https://github.com/nteract/nteract/issues/new/choose) and add the `pkg:myths` label.

## License

[BSD-3-Clause](https://choosealicense.com/licenses/bsd-3-clause/)
