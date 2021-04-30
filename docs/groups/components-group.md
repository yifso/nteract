# Components

The **Components** group is the set of SDK packages for displaying and styling notebooks. This group provides the tools for manipulating visual notebook elements.

**Table of contents**

[TOC]  

---

## /stateful-components

The /stateful-components package exports a set of React components that are connected to the Redux and an unconnected set of components.

### Using /stateful-components

Use the connected components to render different components within a notebook while building a notebook-based application using the nteract Core SDK. These components include Cells and Outputs using the data stored in the Redux store.

These connected components work with the Redux state model that the nteract Core SDK uses. Specific locations within the Redux subtree store these expected properties.

**Example:**

To use the connected components, import each of the components from the `@nteract/stateful-components` package as needed.

In the example below, the connected `CodeCell` component expects to receive a `contentRef` and an `id`. The `contentRef` is a unique ID to refer to the model of a particular notebook in the nteract core Redux state. The `id` is the cell ID that references the cell as it is stored in the nteract core Redux state.

```js
import { CodeCell } from "@nteract/stateful-components";

class MyApp extends React.Component {
    render() {
        return <CodeCell contentRef={contentRef} id={cellId}>;
    }
}
```

All the connected components expect either a `contentRef` or an `id`. These two pieces of information resolve the correct data from the Redux state and pass it to the component.

### Extending notebook UI

This suite of React components provides several points of extensibility for the UI.

#### Extending Editors

nteract ships with the CodeMirror and Monaco editors in its desktop app and Jupyter extensions. However, alternative editors are available for use in your own notebook-based UI. 

**Example:**

To add your own editor to the nteract UI, create a React component that encompasses the editor.

```js
class MyCoolEditor extends React.Component {
    static defaultProps = {
        editorType = "myeditor"
    }

    render() {
        return <textarea/>
    }
}
```

The `editorType` default prop is important as `editorType` selects between different types of editors.

```js
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

The `Editor` stateful component takes a `cellId` and a `contentRef`, extracts the relevant state properties from the state, and passes them to the child editors.

#### Extending Cells

The /stateful-components package ships with a default set of implementations for different types of cells: markdown, code, and raw. 

**Example:**

To add your own set of cells, override the children of the `Cells` component and render your own custom `Cell` components for each cell_type. To override the default `MarkdownCell`, see the following code.

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

This pattern is similar to creating configurable editors. Configurable cells require a `cell_type` prop on the child component that matches the intended rendering `cell_type` from the component.

#### Name-slot based child composition patterns

The "Extending Cells" pattern provides a strategy for overriding the entire default implementation for cells exported by nteract.

**Example:**

To override particular components only, the /stateful-components package supports name slot-based component overrides. 

To override just the `Prompt` component within a CodeCell, define your own `Prompt` component. The code below is an example of this process.

```js
class MyPrompt extends React.Component {
  static displayName = "Prompt";

  render() {
    return <p>Your custom prompt here</p>;
  }
}
```

Pass the `Prompt` component as a named child to the nteract exported `CodeCell` component.

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

The following table of parent and child components show currently enabled overrides.

| Parent Component | Child Component |
| ---------------- | --------------- |
| CodeCell         | pagers          |
| CodeCell         | prompt          |
| CodeCell         | outputs         |
| CodeCell         | editor          |
| CodeCell         | inputPrompts    |
| MarkdownCell     | editor          |
| RawCell          | editor          |

### Styling UIs

> NOTE: Styling support for /stateful-component is in-progress.

In nteract, stateful components are unstyled by default. This gives you the ability to configure your UI experience to your own preferences.

Style stateful components using either CSS-in-JS modules like styled-components or via stylesheets.

#### Styling with styled-components

The code examples below show two methods of styling.

**Example:**

To style individual components, import `styled-components` as needed.

```js
import { CodeCell } from "@nteract/stateful-components";
import styled from "styled-components";

const StyledCodeCell = styled(CodeCell)`
    // your styles are here
`
```

Alternativelly, style the pre-built `Notebook` component with styled-components. Use class names to target individual components.

```js
import { Notebook } from "@nteract/stateful-components"

const StyledNotebook = styled(Notebook)`
    .nteract-code-cells {
        background-color: blue;
    }
`
```

#### Styling with stylesheets

To style with stylesheets, use element and combinator-based CSS selectors to your configurations of styled elements.

The following table outlines each stateful component, CSS classname, and other conditional applications of CSS classes.

| Component | Class Name | Other Class Names |
| --- | --- | --- |
| Prompt | `.nteract-prompt-component` | |
| Output | `.nteract-output-component` | `.hidden .expanded` |

### Examples of /stateful-components

This section showcases how the `/stateful-components` package builds different notebook interfaces. 

#### How to render a notebook without customizations

**Example:**

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

#### How to override default editors in the Notebook component

**Example:**

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

#### How to disable editing of markdown cells in a notebook application

**Example:**

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

#### How to override the Output display in code cells

**Example:**

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

## /notebook-app-component

The /notebook-app-component standardizes the implementation of a Jupyter notebook UI. This single-purpose component renders a notebook UI with code cells, Markdown cells, cell prompts, and code cell outputs. This UI implementation helps to streamline apps. This sample implementation also helps developers extend their work.

### Example

This complex component requires you to setup the Redux store that the other nteract apps use. Review the desktop app or Jupyter extensions as examples.

**Example:**

```js
import NotebookApp from "@nteract/notebook-app-component";

<NotebookApp
  // The desktop app always keeps the same contentRef in a
  // browser window
  contentRef={contentRef}
/>
```

## /presentational-components

This package contains React components for rendering inputs, outputs, cells, and other key UI elements within nteract applications.

### Example

The Redux reducer below shows how to leverage components within this package to display a cell with an input and output.

**Example:**

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

## /styles

The /styles package is a collection of basic CSS styles. These are helpful for bootstrapping the UI of the page. The following table contains each of the .CSS files within the package.

| .CSS file |
| --- |
| `app.css` |
| `cell-menu.css` |
| `command-palette.css` |
| `editor-overrides.css` |
| `global-variables.css` |
| `sidebar.css` |
| `toggle-switch.css` |
| `toolbar.css` |
