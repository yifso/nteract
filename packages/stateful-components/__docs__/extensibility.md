# Extending your notebook UI with @nteract/stateful-components

This suite of React components provides several points of extensibility for the UI. This document covers them here.

## Extending editors

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

## Extending Cells

The @nteract/stateful-components package ships with a default set of implementations for different types of cells: markdown, code, and raw. How do you go about adding your own set of cells?

You can override the children of the `Cells` component and render your own custom `Cell` components for each cell_type. For example, to override the default `MarkdownCell`, you can do the following.

```
import { Cells, CodeCell, RawCell } from "@nteract/stateful-components"

class MarkdownCell extends React.Component {
    static defaultProps = {
        cell_type: "markdown"
    }

    render() {
        return <p>{this.props.value}</p>;
    }
}

class MyCells extends React.Component {
    render() {
        return <Cells>
            <MarkdownCell id={cellId} contentRef={contentRef}/>
            <CodeCell id={cellId} contentRef={contentRef}/>
            <RawCell id={cellId} contentRef={contentRef}/>
        </Cells>
    }
}
```

Similar to the pattern for creating configurable editors, configurable cells require that a `cell_type` prop exist on the child component that matches the `cell_type` the component is intended to render.
