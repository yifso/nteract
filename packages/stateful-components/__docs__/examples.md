# @nteract/stateful-components Examples

This document showcases how the @nteract/stateful-components package can be used to build different notebook interfaces. Before reading this document, you might want to take a look at [the overview](./overview.md) and the [extensibility](./extensibility.md) documents.

## How do I render a notebook without any customizations?

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

```
import Notebook, { CodeCell, MarkdownCell, RawCell } from "@nteract/stateful-components";

class CodeEditor extends React.Component {
    static displayName = "Editor";

    render() {
        return <div><Editor />{this.props.editorButtons.map(Button => <Button/>)}</div>;
    }
}

class MDEditor extends React.Component {
    static displayName = "Editor";

    render() {
        return <div><Editor />{this.props.editorButtons.map(Button => <Button/>)}</div>;
    }
}

class MyNotebook extends React.Component {
    render() {
        return <Notebook>
            <CodeCell>
                <CodeEditor>
            </CodeCell>
            <MarkdownCell>
                <MDEditor>
            </MarkdownCell>
            <RawCell>
                <Editors>
            </RawCell>
        </Notebook>;
    }
}

data = {
    CodeCell:{
            Editor:"CodeEditor"
    }
}

function
```

## How do I disable editing of markdown cells in my notebook application?

```
import Notebook, { CodeCell, MarkdownCell, RawCell } from "@nteract/stateful-components";

class Editors extends React.Component {
    static displayName = "Editors";

    render() {
        return <MyMarkdownRenderer />;
    }
}

class MyNotebook extends React.Component {
    render() {
        return <Notebook>
            <CodeCell/>
            <MarkdownCell>
            <Override>
                <Editors>
                </Override>
            </MarkdownCell>
            <RawCell/>
        </Notebook>;
    }
}
```

## How do I override the Output display in code cells?

```
import Notebook, { CodeCell, MarkdownCell, RawCell } from "@nteract/stateful-component";

class Outputs extends React.Component {
    static displayName = "Outputs";

    render() {
        return <div>
            <h1>No outputs for you!</h1>
        </div>;
    }
}

class OurPrompt extends React.Component {
    static displayName = "Prompt";

    render() {
        return <div>
            <h1>No promt for you!</h1>
        </div>;
    }
}

clas MyNotebook extends React.Component {
    render() {
        return <Notebook>
            <CodeCell>
                <Outputs/>
            </CodeCell>
        </Notebook>;
    }
}

class OurOutputs {
    displayName = "Outputs";

    render() {
        return <React.Fragment>
            <NteractOutputs id={id} contentRef={contentRef}/>
            {this.props.extensionOutputs.map(Outputs => <Outputs/>)}
    }
}
```
