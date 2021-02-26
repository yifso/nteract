# Components

**Table of contents**
- /notebook-app-component
- /presentational-components
- /stateful-components
- /styles

## /notebook-app-component
A monolithic notebook app, in a component

### Installation
```
npm install --save @nteract/notebook-app-component
```

### Usage

This component is not for the faint of heart. It requires you to setup the redux store used by the other nteract apps. You can check out desktop or jupyter extension for examples.

```jsx
import NotebookApp from "@nteract/notebook-app-component";

<NotebookApp
  // The desktop app always keeps the same contentRef in a
  // browser window
  contentRef={contentRef}
/>
```

## /presentational-components
This package contains React components for rendering inputs, outputs, cells, and other key UI elements within nteract applications.

### Installation

```
$ yarn add @nteract/presentational-components
```

```
$ npm install --save @nteract/presentational-components
```

### Usage

The Redux reducer below shows how we can leverage the components within this package to display a cell with an input and output.

```javascript
import {
  Cell,
  Input,
  Prompt,
  Source,
  Outputs
} from "@nteract/presentational-components";

export default () => {
  return (
    <Cell isSelected>
      <Input>
        <Prompt counter={2} />
        <Source language="python">{`print("Hello World")`}</Source>
      </Input>
      <Outputs>
        <pre>Hello World</pre>
      </Outputs>
    </Cell>
  );
};
```

## /stateful-components

The @nteract/stateful-components package exports a set of React components that are connected to the Redux and an unconnected set of components.

### Using stateful-components with the nteract core SDK

If you're building a notebook-based application using the nteract core SDK, you can use the connected components to render different components within a notebook, such as Cells and Outputs using the data that is stored in the Redux store.

These connected components are designed to work with the Redux state model that the nteract core SDK uses. In short, it expects that certain properties are stored in particular locations within the Redux subtree.

To use the connected components, you can import each of the components from the `@nteract/stateful-components` package as needed.

```
import { CodeCell } from "@nteract/stateful-components";

class MyApp extends React.Component {
    render() {
        return <CodeCell contentRef={contentRef} id={cellId}>;
    }
}
```

As you can see from the example above, the connected `CodeCell` component expects to receive a `contentRef` and an `id`. The `conntetRef` is a unique ID that is used to refer to the model of a particular notebook in the nteract core Redux state. The `id` is the cell ID that references the cell as it is stored in the nteract core Redux state.

All the connected components expect either a `contentRef` or a `id`. These two pieces of information are used to resolve the correct data from the Redux state and pass it to the component.

### Extending your notebook UI with @nteract/stateful-components

This suite of React components provides several points of extensibility for the UI. This document covers them here.

#### Extending Editors

nteract ships with the CodeMirror editor in its desktop and Jupyter extensions. However, you might want to use an alternative editor in your own notebook based UI. To add your own editor to the nteract UI, create a React component that encompasses the editor.

```
class MyCoolEditor extends React.Component {
    static defaultProps = {
        editorType = "myeditor"
    }

    render() {
        return <textarea/>
    }
}
```

The `editorType` default prop is important here. The `editorType` is used to select between different types of editors.

```
import { Editor } from "@nteract/stateful-components"
import CodeMirrorEditor from "@nteract/editor"
import MyCoolEditor from "./my-cool-editor";

class Editor extends React.Component {
    render() {
        return <Editor id={cellId} contentRef={contentRef}>
            <CodeMirrorEditor />
            <MyCoolEditor />
        </Editor>;
    }
}
```

The `Editor` stateful component take a `cellId` and a `contentRef`, extracts the relevant state properties from the state, and passes them to the child editors.

#### Extending Cells

The @nteract/stateful-components package ships with a default set of implementations for different types of cells: markdown, code, and raw. How do you go about adding your own set of cells?

You can override the children of the `Cells` component and render your own custom `Cell` components for each cell_type. For example, to override the default `MarkdownCell`, you can do the following.

```js
import { Cells, CodeCell, RawCell } from "@nteract/stateful-components";

class MarkdownCell extends React.Component {
  static defaultProps = {
    cell_type: "markdown"
  };

  render() {
    return <p>{this.props.value}</p>;
  }
}

class MyCells extends React.Component {
  render() {
    return (
      <Cells>
        {{
          markdown: <MarkdownCell id={cellId} contentRef={contentRef} />,
          code: <CodeCell id={cellId} contentRef={contentRef} />,
          raw: <RawCell id={cellId} contentRef={contentRef} />
        }}
      </Cells>
    );
  }
}
```

Similar to the pattern for creating configurable editors, configurable cells require that a `cell_type` prop exist on the child component that matches the `cell_type` the component is intended to render.

#### Name-slot based child composition patterns

We've all been in that situation where we were generally happy with something but wanted one small thing changed. The "Extending Cells" pattern provides a strategy for overriding the entire default implementation for cells exported by nteract, but what if we wanted to override only particular components.

The @nteract/stateful-components package has support for name slot-based component overrides. For example, let's say you want to override just the `Prompt` component within a CodeCell. You can do this by defining your own `Prompt` component.

```js
class MyPrompt extends React.Component {
  static displayName = "Prompt";

  render() {
    return <p>Your custom prompt here</p>;
  }
}
```

Then passing that `Prompt` component as a named child to the `CodeCell` component exported by nteract.

```js
import { CodeCell } from "@nteract/stateful-components";

class MyCodeCell extends React.Component {
    render() {
        return <CodeCell>
            {{ prompt: <Prompt> }}
        </CodeCell>;
    }
}
```

Overrides are currently enabled for the following parent and child components.

| Parent Component | Child Component |
| ---------------- | --------------- |
| CodeCell         | pagers          |
| CodeCell         | prompt          |
| CodeCell         | outputs         |
| CodeCell         | editor          |
| CodeCell         | inputPrompts    |
| MarkdownCell     | editor          |
| RawCell          | editor          |

### Styling UIs built with @nteract/stateful-components

NOTE: Styling support for @nteract/stateful-component is in-progress.

nteract's stateful components are unstyled by default. That's right -- a beautiful blank canvas for you to paint your own experience to.

You can style stateful components using either CSS-in-JS modules like styled-components or via stylesheets.

#### Styling with styled-components

To style individual components with `styled-components` you can import them individually and style them as needed.

```
import { CodeCell } from "@nteract/stateful-components";
import styled from "styled-components";

const StyledCodeCell = styled(CodeCell)`
    // your styles are here
`
```

Alternativelly, you can style the pre-built `Notebook` component with styled-components and use class names to target individual components.

```
import { Notebook } from "@nteract/stateful-components"

const StyledNotebook = styled(Notebook)`
    .nteract-code-cells {
        background-color: blue;
    }
`
```

#### Styling with stylesheets

To style with stylesheets, you can use element and combinator-based CSS selectors to desire styled elements as you wish.

The following table outlines each stateful component, its CSS classname, and other CSS classes that can be conditionally applied to it.

| Component | Class Name | Other Class Names |
| Prompt | | `.nteract-prompt-component` | |
| Output | `.nteract-output-component` | `.hidden .expanded` |

### @nteract/stateful-components Examples

This document showcases how the `@nteract/stateful-components` package can be used to build different notebook interfaces. Before reading this document, you might want to take a look at [the overview](./overview.md) and the [extensibility](./extensibility.md) documents.

#### How do I render a notebook without any customizations?

To import the standard layout of the notebook, use the `Notebook` default export from the `@nteract/stateful-components` package.

```js
import Notebook from "@nteract/stateful-components";

class MyApp extends React.Component {
  render() {
    return (
      <React.Fragment>
        <MySiderbar />
        <Notebook />
        <MyLeftPanel />
      </React.Fragment>
    );
  }
}
```

#### How do I override the default editors in the Notebook component?

Create a React component and override the `editor` child property in each cell component.

```js
import Notebook, {
  CodeCell,
  MarkdownCell,
  RawCell
} from "@nteract/stateful-components";

class Editor extends React.Component {
  render() {
    return <div>Test</div>;
  }
}

class MyNotebook extends React.Component {
  render() {
    return (
      <Notebook>
        <CodeCell>
          {{
            editor: <Editor />
          }}
        </CodeCell>
        <MarkdownCell>
          {{
            editor: <Editor />
          }}
        </MarkdownCell>
        <RawCell>
          {{
            editor: <Editor />
          }}
        </RawCell>
      </Notebook>
    );
  }
}
```

#### How do I disable editing of markdown cells in my notebook application?

Create a React component and override the `editor` child property in the `MarkdownCell` component.

```js
import Notebook, { MarkdownCell } from "@nteract/stateful-components";

class Editors extends React.Component {
  render() {
    return <MyMarkdownRenderer />;
  }
}

class MyNotebook extends React.Component {
  render() {
    return (
      <Notebook>
        {{
          markdown: (
            <MarkdownCell>
              {{
                editor: <Editor />
              }}
            </MarkdownCell>
          )
        }}
      </Notebook>
    );
  }
}
```

#### How do I override the Output display in code cells?

Create a React component and override the `outputs` property in the `CodeCell` component.

```js
import Notebook, { CodeCell } from "@nteract/stateful-component";

class Outputs extends React.Component {
  render() {
    return (
      <div>
        <h1>No outputs for you!</h1>
      </div>
    );
  }
}

class MyNotebook extends React.Component {
  render() {
    return (
      <Notebook>
        {{ code: <CodeCell>{{ outputs: <Outputs /> }}</CodeCell> }}
      </Notebook>
    );
  }
}
```

## /styles