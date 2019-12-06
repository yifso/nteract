# @nteract/stateful-components Examples

This document showcases how the @nteract/stateful-components package can be used to build different notebook interfaces. Before reading this document, you might want to take a look at [the overview](./overview.md) and the [extensibility](./extensibility.md) documents.

## How do I render a notebook without any customizations?

To import the standard layout of the notebook, use the `Notebook` default export from the `@nteract/stateful-components` package.

```
import Notebook from "@nteract/stateful-components";

class MyApp extends React.Component {
    render() {
        return <React.Fragment>
            <MySiderbar />
            <Notebook />
            <MyLeftPanel />
        </React.Fragment>;
    }
}
```

## How do I override the default editors in the Notebook component?

Create a React component with the `displayName` set to `Editor`. Set this component as a child component for each cell component.

```
import Notebook, { CodeCell, MarkdownCell, RawCell } from "@nteract/stateful-components";

class Editor extends React.Component {
    static displayName = "Editor";

    render() {
        return <div>Test</div>
    }
}

class MyNotebook extends React.Component {
    render() {
        return <Notebook>
            <CodeCell>
                <Editor>
            </CodeCell>
            <MarkdownCell>
                <Editor>
            </MarkdownCell>
            <RawCell>
                <Editor>
            </RawCell>
        </Notebook>;
    }
}
```

## How do I disable editing of markdown cells in my notebook application?

Create a React component with the `displayName` set to `Editor`. Implement a renderer in your React component, using `@nteract/markdown`. Rejoice!

In the example below, only the `MarkdownCell` is customized. The `CodeCell` and `RawCell` maintain their standard configurations.

```
import Notebook, { MarkdownCell } from "@nteract/stateful-components";

class Editors extends React.Component {
    static displayName = "Editor";

    render() {
        return <MyMarkdownRenderer />;
    }
}

class MyNotebook extends React.Component {
    render() {
        return <Notebook>
            <MarkdownCell>
                <Editor>
            </MarkdownCell>
        </Notebook>;
    }
}
```

## How do I override the Output display in code cells?

Create a React component with the `displayName` set to `Outputs` and add it as a child to the `Notebook` component.

In the example below, only the `CodeCell` is customized. The `MarkdownCell` and `RawCell` maintain their standard configurations.

```
import Notebook, { CodeCell } from "@nteract/stateful-component";

class Outputs extends React.Component {
    static displayName = "Outputs";

    render() {
        return <div>
            <h1>No outputs for you!</h1>
        </div>;
    }
}


class MyNotebook extends React.Component {
    render() {
        return <Notebook>
            <CodeCell>
                <Outputs/>
            </CodeCell>
        </Notebook>;
    }
}
```
