# Jupyter Protocol and Specification

**Table of contents**
- [/commutable](#/commutable)
  - [Notebook format](#/Notebook-format)
  - [/commutable in-memory format](#/commutable-in-memory-format)
  - [Examples](#Examples-of-/commutable)
- [/messaging](#messaging)
- [/rx-jupyter](/rx-jupyter)

## /commutable
@nteract/commutable is a package for creating an in-memory immutable representation of a Jupyter notebook.

This package follows the principles below. Tom MacWright's [outline for practical undo](http://www.macwright.org/2015/05/18/practical-undo.html) offers the fundamental ideas below.

- A notebook document is immutable. The notebook document's representation is never mutated in-place.
- Operations form the changes to a notebook document. They take a previous version and return a new version of the notebook without modifying the old version.
- A list of states composes the history. The past is on one end and the present is on the other. The index backs up into 'undo states'.
- Modifying a notebook document discards any future states.

@nteract/commutable builds on top of the [ImmutableJS](https://immutable-js.github.io/immutable-js/) library.

### Notebook format

Jupyter notebooks serialize into files with ipynb extensions. These files are JSON-based and follow a schema. The definition of the schema is in the [nbformat specification](https://nbformat.readthedocs.io/en/latest/).

The top-level properties in the notebook have the following schema.

**Example:**

```json
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

The `cells` properties contain a list of cells in the notebook. The fundamental structure for a cell uses the format below.

```json
{
  "cell_type" : "type",
  "metadata" : {},
  "source" : "single string or [list, of, strings]",
}
```

For examples of serialized Jupyter notebooks, view the [raw JSON for an example notebook](https://raw.githubusercontent.com/nteract/examples/master/python/intro.ipynb).

### /commutable in-memory format

The /commutable package converts the serialized representation into an immutable in-memory representation. The structure of the in-memory representation is different as the design is for easier in-memory format use when developing interactive notebook UIs. The interface for a notebooks is in the example below.

**Example:**

```js
export interface NotebookRecordParams {
  cellOrder: ImmutableList<CellId>;
  cellMap: ImmutableMap<CellId, ImmutableCell>;
  nbformat_minor: number;
  nbformat: number;
  metadata: ImmutableMap<string, any>;
}
```

> NOTE: This package generates a unique CellId for each cell it encounters when parsing the notebook. These CellIds are uuid-v4 identifiers. These refer to the cell in the in-memory store.

- `cellOrder`: A list of CellIds in order of appearance in the notebook.
- `cellMap`: An map that associates a CellId with the ImmutableCell it represents.
- `nbformat`, `nbformat_minor`: The version of the nbformat that this notebook follows.
- `metadata`: Top-level metadata stored in the notebook.

This Jupyter specification outlines three different cell types: code cells, Markdown cells, and raw cells. The /commutable package provides type interfaces and functions. These help create data objects to match the specifications of cell types.

#### Transient nteract data

The in-memory format includes an `nteract.transient` metadata field in each cell. This enables UI-specific interactions for nteract-based interfaces. Metadata fields in the Jupyter nbformat have no strong types. If a UI doesn't understand how to interpret a particular metadata field, it is safe for the UI to ignore the metadata field.

Users opening a notebook in nteract, working with the notebook altering its metadata property, then using another Jupyter UI do not cause issues to the notebook. 

#### /commutable API documentation

All support actions are in [this package's API docs](https://packages.nteract.io/modules/commutable.html).

### Examples of /commutable

#### Creating a notebook in-memory model

To create an in-memory model of a notebook, pass a string containing the serialized contents of the notebook to the `fromJS` function.

In the example below, `notebookString` loads from a Jupyter server via the Jupyter Contents API. A filesystem API retrieves it from disk and loads it from a cloud storage provider with their API or anywhere else. The `notebookString` converts to the in-memory model when following the nbformat.

**Example:**

```js
import { fromJS } from "@nteract/commutable";

const notebookString = "{ cells: [...], metadata: {...} }";
const immutableNotebook = fromJS(notebookString);
```

#### Create a code cell

To create a code cell, use the `makeCodeCell` function in the commutable API.

**Example:**

```js
import { makeCodeCell } from "@nteract/commutable";

const codeCell = makeCodeCell({
  source: "print(1)"
});
```

> NOTE: Not all the properties for a cell in the parameter passed to the `makeCodeCell` method. The package uses sensible defaults where appropriate. There are analogous functions to create other types of cells, such as `makeMarkdownCell` and `makeRawCell`.


## /messaging

This package contains type definitions and helper functions for interacting with the [Jupyter Messaging Protocol](https://jupyter-client.readthedocs.io/en/stable/messaging.html). These functions create different types of request and response messages.

### Example

The example below shows how to use the `createMessage` function in this package to create an [inspect_request](https://jupyter-client.readthedocs.io/en/stable/messaging.html#introspection) Jupyter message.

**Example:**
```javascript
import { createMessage } from "@nteract/messaging";

const message = createMessage("inspect_request", {
  code: "string.for",
  cursor_pos: 10,
  detail_level: 1
});
```

## /rx-jupyter

This package is a [ReactiveX](http://reactivex.io/) wrapper around the [Jupyter Server API](http://jupyter-api.surge.sh/). **rx-jupyter** helps query local and remote Jupyter Server instances using Jupyter's Services APIs. Also, **rx-jupyter** integrates responses seamlessly with [RxJS](https://rxjs-dev.firebaseapp.com/)'s functional tooling.

### Example

The example below shows how to use this package to get the version of the Jupyter server API the endpoint is running.

**Example:**
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
