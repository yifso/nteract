# Editors

The **Editors** group of SDK packages is a set of supported editors in nteract applications. These render within cell components and provide additional functionality such as *autocomplete* as well as *advanced syntax highlighting*.

**Table of contents**

[TOC]  

---

## /editor

This package contains components for rendering CodeMirror editors in our nteract applications. To see this package in action, view the source code for the [nteract play application](https://github.com/nteract/play).

### Examples of /editor

The example below shows how to use this package to create a simple code editor component.

**Example:**

```javascript
import CodeMirrorEditor from "@nteract/editor";

<CodeMirrorEditor
  cellFocused
  editorFocused
  completion
  theme="light"
  id="just-a-cell"
  onFocusChange={() => {}}
  focusAbove={() => {}}
  focusBelow={() => {}}
  kernelStatus={"not connected"}
  options={{
    lineNumbers: true,
    extraKeys: {
      "Ctrl-Space": "autocomplete",
      "Ctrl-Enter": () => {},
      "Cmd-Enter": () => {}
    },
    cursorBlinkRate: 0,
    mode: "python"
  }}
  value={"import pandas as pd"}
  onChange={() => {}}
/>;
```

## /monaco-editor

This package implements a React component with a Monaco-based code editor. To see this package in action, view the source code for rendering text files in the [nteract-on-Jupyter application](https://github.com/nteract/nteract/blob/master/applications/jupyter-extension/nteract_on_jupyter/app/contents/file/text-file.js).

### Examples of /monaco-editor

The example below shows how to use this package to render an editor for plain-text content.

**Example:**

```javascript
import MonacoEditor from "@nteract/monaco-editor";

export default () => {
  return (
    <MonacoEditor
      id="foo"
      contentRef="bar"
      theme="vscode"
      language="plaintext"
      value={"These are some words in an editor."}
    />
  );
};
```

### Documentation

#### Editor

The `monaco-editor` package provides the core functionality to render [Monaco Editor](https://microsoft.github.io/monaco-editor/) as a React component. It also fetches code tab-completion items when running a notebook connected to a Jupyter kernel. To coordinate with notebook semantics, the package requires the following props in the `IMonacoProps` interface:

* `id` - A unique identifier for the editor instance. In the notebook context, since every cell is tied to a single instance of the editor, `id` refers to the unique ID of the cell.
* `contentRef` - A unique identifier for the editor's host application. In the notebook context, `contentRef` provides a reference to the container element for the main notebook app component.
* `theme` - Theme for rendering the component ([docs](https://microsoft.github.io/monaco-editor/api/interfaces/monaco.editor.idiffeditorconstructionoptions.html#theme))
* `language` - Valid language ID of a supported language (eg: `python`, `typescript`, `plaintext` etc.) Refer to the [Monaco Editor playground](https://microsoft.github.io/monaco-editor/playground.html#extending-language-services-custom-languages) to add support for a language not yet supported.

nteract provides the minimum required props to instantiate the component and also support for a host of optional properties and handlers. See the code below for optional properties.

`options` - Specify a list of supported [EditorOptions](https://microsoft.github.io/monaco-editor/api/interfaces/monaco.editor.ieditoroptions.html) as key-value pairs when instantiating the component.

Important callbacks:

* `onChange: (value: string, event?: any) => void` - Contents of the editor are changed.
* `onFocusChange: (focus: boolean) => void` - The Editor Component loses or gains focus.
* `onCursorPositionChange: (selection: monaco.ISelection | null) => void` - Cursor position changes.
* `onDidCreateEditor: (editor: monaco.editor.IStandaloneCodeEditor) => void;` - Created editor.

#### Completions

The package also adds the capability to retrieve code-completion items from a connected Jupyter kernel. Completions are language-specific token recommendations when the user attempts to type or enumerate the attributes of a class/object.  A `dot` operator and the `tab` completion key are common. 

nteract has a default completion provider that works with the Jupyter kernel. nteract also supports custom completion providers for users registering their own language service.

![jupyter completions](https://i.stack.imgur.com/rcieN.png)

**Example::**

The props below controll completion behavior.

* `enableCompletion` - Boolean flag to enable/disable the behavior entirely.
* `shouldRegisterDefaultCompletion` - Boolean flag to enable/disable the default completion provider.
* `onRegisterCompletionProvider?: (languageId: string) => void` - Custom completion provider implementation for a Monaco Editor supported language.

#### Formatting

The following prop also enables code formatting.
* `onRegisterDocumentFormattingEditProvider?: (languageId: string) => void` - Custom formatting provider implementation for a Monaco Editor supported language.

#### Performance tip

Enable completions in your app when you use this package on a [`Web worker`](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers) separate from the UI thread. This provides a performance boost and ensures that the app doesn't stall UI updates when the editor is waiting for Jupyter Kernel completions. 

nteract uses the [Monaco Editor Web pack plugin](https://github.com/microsoft/monaco-editor-webpack-plugin) to register and use the Monaco `editor` worker. View the [Monaco Editor docs](https://github.com/microsoft/monaco-editor/blob/master/docs/integrate-esm.md) for more information on configuring the package and setting up other web workers.

**Example:**

To improving window resizing performance, see the example below.

Resizing the browser window recalculates the width of the container of this component. The code below shows CSS overrides for better performance.

```css
.monaco-container .monaco-editor {
  width: inherit !important;
}

.monaco-container .monaco-editor .overflow-guard {
  width: inherit !important;
}

/* 26px is the left margin for .monaco-scrollable-element  */
.monaco-container .monaco-editor .monaco-scrollable-element.editor-scrollable.vs {
  width: calc(100% - 26px) !important;
}
```

These style overrides for resize performance are also in the `@nteract/styles` package.
Import the CSS in a top level React component with the code below.

```typescript
import "@nteract/styles/monaco/overrides.css";
```
