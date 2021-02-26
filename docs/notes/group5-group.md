# Group 5 (name tentative)

**Table of contents**
- /commutable
- /messaging
- /rx-jupyter

## /commutable
@nteract/commutable is a package that is used to create an in-memory Immutable representation of a Jupyter notebook.

This package follows the principles below, based on Tom MacWright's [outline for practical undo](http://www.macwright.org/2015/05/18/practical-undo.html).

- A notebook document is immutable. The notebook document's representation is never mutated in-place.
- Changes to a notebook document are encapsulated into operations that take a previous version and return a new version of the notebook without modifying the old version.
- History is represented as a list of states, with the past on one end, the present on the other, and an index that can back up into 'undo states'.
- Modifying a notebook document causes any future states to be thrown away.

@nteract/commutable guilds on top of the [ImmutableJS](https://immutable-js.github.io/immutable-js/) library.

### The Notebook Format

Jupyter notebooks are serialized into files with ipynb extensions. These files are JSON-based and follow a schema that is defined in the [nbformat specification](https://nbformat.readthedocs.io/en/latest/).

The top-level properties in the notebook have the following schema.

```
{
  "metadata" : {
    "kernel_info": {
        # if kernel_info is defined, its name field is required.
        "name" : "the name of the kernel"
    },
    "language_info": {
        # if language_info is defined, its name field is required.
        "name" : "the programming language of the kernel",
        "version": "the version of the language",
        "codemirror_mode": "The name of the codemirror mode to use [optional]"
    }
  },
  "nbformat": 4,
  "nbformat_minor": 0,
  "cells" : [
      # list of cell dictionaries, see below
  ],
}
```

The `cells` properties contains a list of cells that exist in the notebook. The fundamental structure for a cell obeys the following format.

```
{
  "cell_type" : "type",
  "metadata" : {},
  "source" : "single string or [list, of, strings]",
}
```

For examples of serialized Jupyter notebooks, you can view the raw JSON for an example notebook [here](https://raw.githubusercontent.com/nteract/examples/master/python/intro.ipynb).

### The @nteract/commutable In-Memory Format

As mentioned earlier, this package converts the serialized representation summarized above into an immutable in-memory representation. The structure of the in-memory representation is a little different. Most importantly, it is designed to make ti easier to use the in-memory format when developing interactive notebook UIs. The interface for a notebooks is follows.

```
export interface NotebookRecordParams {
  cellOrder: ImmutableList<CellId>;
  cellMap: ImmutableMap<CellId, ImmutableCell>;
  nbformat_minor: number;
  nbformat: number;
  metadata: ImmutableMap<string, any>;
}
```

Note that this package will generate a unique CellId for each cell it encounters when parsing the notebook. These CellIds are uuid-v4 identifiers that are used to refer to the cell in the in memory store.

- `cellOrder`: A list of CellIds in order of appearance in the notebook
- `cellMap`: An map that associates a CellId with the ImmutableCell it represents
- `nbformat`, `nbformat_minor`: The version of the nbformat that this notebook follows
- `metadata`: Top-level metadata stored in the notebook

This package includes strongly-typed interfaces and creators for each cell type that exists in the Jupyter nbformat specification: code cells, markdown cells, and raw cells. For more information on this, view the examples for this package.

#### Transient nteract Data

The in-memory format includes an `nteract.transient` metadata field in each cell. This is used to enable UI-specific interactions for nteract-based interfaces. Metadata fields in the Jupyter nbformat are not strongly typed and can be safely ignored by UIs that don't understand how to interpret a particular metadata field.

This means that if a user opens a notebook in nteract, interacts with it in a fashion that stores state in the metadata property, then opens the notebook in another Jupyter UI, the notebook will still be usable.

#### Where is the commutable package API documented?

You can find a list of all the support actions [in the API docs for this package](https://packages.nteract.io/modules/commutable.html).

### Examples

#### Create an in-memory model of a notebook

To create an in-memory model of a notebook, pass a string containing the serialized contents of the notebook to the `fromJS` function.

```js
import { fromJS } from "@nteract/commutable";

const notebookString = "{ cells: [...], metadata: {...} }";
const immutableNotebook = fromJS(notebookString);
```

In the example above, `notebookString` can be loaded from a Jupyter server via the Jupyter Contents API, retrieved from disk using a filesystem API, loaded from a cloud storage provider with their API, or anywhere else. As long as it is a string that follows the nbformat, it will be converted to the in-memory model.

#### Create a code cell

To create a code cell, you can use the `makeCodeCell` function in the commutable API.

```js
import { makeCodeCell } from "@nteract/commutable";

const codeCell = makeCodeCell({
  source: "print(1)"
});
```

Note that you don't need to provide all the properties for a cell in the parameter passed to the `makeCodeCell` method. The package will use sensible defaults where appropriate. There are analogous functions to create other types of cells, such as `makeMarkdownCell` and `makeRawCell`.


## /messaging

This package contains type definitions and helper functions for interacting with the [Jupyter Messaging Protocol](https://jupyter-client.readthedocs.io/en/stable/messaging.html). These functions can be used to create different types of request and response messages.

### Installation

```
$ yarn add @nteract/messaging
```

```
$ npm install --save @nteract/messaging
```

### Usage

The example below shows how we can use the `createMessage` function in this package to create an [inspect_request](https://jupyter-client.readthedocs.io/en/stable/messaging.html#introspection) Jupyter message.

```javascript
import { createMessage } from "@nteract/messaging";

const message = createMessage("inspect_request", {
  code: "string.for",
  cursor_pos: 10,
  detail_level: 1
});
```

## /rx-jupyter

This package is a [ReactiveX](http://reactivex.io/) wrapper around the [Jupyter Server API](http://jupyter-api.surge.sh/). **rx-jupyter** can help you query local and remote Jupyter Server instances using Jupyter's Services APIs. Also, **rx-jupyter** integrates responses seamlessly with [RxJS](https://rxjs-dev.firebaseapp.com/)'s functional tooling.

### Roadmap

Primary coverage of the [Jupyter Server API]:

- [x] Contents
  - [x] Checkpoints
- [x] Kernels
- [x] Kernelspecs
- [x] Sessions
- [x] Terminals

Optional coverage:

- [ ] Config
- [ ] nbconvert
- [ ] spec.yaml `/api/spec.yaml`

### Installation

```
$ yarn add rx-jupyter
```

```
$ npm install --save rx-jupyter
```

### Usage

The example below shows how we can use this package to get the version of the Jupyter server API our endpoint is running.

```javascript
import jupyter from "rx-jupyter";
import { of } from "rxjs";
import { mergeMap, catchError } from "rxjs/operators";

const apiVersion = jupyter.apiVersion({
  endpoint: "https://myjupyterendpoint.com",
  crossDomain: true
});
apiVersion.pipe(
  mergeMap(apiVersion => of(apiVersionFulfilled({ apiVersion }))),
  catchError(error => of(apiVersionFailed({ error })))
);
```
