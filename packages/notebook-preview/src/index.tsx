import {
  appendCellToNotebook,
  createCodeCell,
  emptyNotebook,
  fromJS
} from "@nteract/commutable";
import { Display } from "@nteract/display-area";
import Markdown from "@nteract/markdown";
import * as MathJax from "@nteract/mathjax";
import {
  Cell,
  Cells,
  Input,
  Outputs,
  Prompt,
  Source,
  themes
} from "@nteract/presentational-components";
import {
  displayOrder as defaultDisplayOrder,
  Transforms,
  transforms as defaultTransforms
} from "@nteract/transforms";
import * as React from "react";
import styled, { createGlobalStyle } from "styled-components";

import { PapermillView } from "./papermill";

interface Props {
  displayOrder: Array<string>;
  notebook: any;
  transforms: Transforms;
  theme: "light" | "dark";
}

interface State {
  notebook: any;
}

const RawCell = styled.pre`
  background: repeating-linear-gradient(
    -45deg,
    transparent,
    transparent 10px,
    #efefef 10px,
    #f1f1f1 20px
  );
`;

const ContentMargin = styled.div`
  padding-left: calc(var(--prompt-width, 50px) + 10px);
  padding-top: 10px;
  padding-bottom: 10px;
  padding-right: 10px;
`;

const Themes = {
  dark: createGlobalStyle`
    :root {
      ${themes.dark}
    }`,
  light: createGlobalStyle`
    :root {
      ${themes.light}
    }`
};

export class NotebookPreview extends React.PureComponent<Props, State> {
  static defaultProps = {
    displayOrder: defaultDisplayOrder,
    transforms: defaultTransforms,
    notebook: appendCellToNotebook(
      emptyNotebook,
      createCodeCell().set("source", "# where's the content?")
    ),
    theme: "light"
  };

  constructor(props: Props) {
    super(props);

    this.state = {
      notebook: fromJS(props.notebook)
    };
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.notebook !== this.props.notebook) {
      this.setState({ notebook: fromJS(nextProps.notebook) });
    }
  }

  render() {
    // TODO: Rely on setState to convert notebook from plain JS to commutable format

    const notebook = this.state.notebook;

    // Propagated from the hide_(all)_input nbextension
    const allSourceHidden = notebook.getIn(["metadata", "hide_input"], false);

    const language = notebook.getIn(
      ["metadata", "language_info", "codemirror_mode", "name"],
      notebook.getIn(
        ["metadata", "language_info", "codemirror_mode"],
        notebook.getIn(["metadata", "language_info", "name"], "text")
      )
    );

    const cellOrder = notebook.get("cellOrder");
    const cellMap = notebook.get("cellMap");

    return (
      <MathJax.Provider>
        <div className="notebook-preview">
          <Cells>
            {cellOrder.map((cellId: string) => {
              const cell = cellMap.get(cellId);
              const cellType = cell.get("cell_type");
              const source = cell.get("source");

              switch (cellType) {
                case "code":
                  const sourceHidden =
                    allSourceHidden ||
                    cell.getIn(["metadata", "inputHidden"]) ||
                    cell.getIn(["metadata", "hide_input"]);

                  const outputHidden =
                    cell.get("outputs").size === 0 ||
                    cell.getIn(["metadata", "outputHidden"]);

                  let papermillStatus = cell.getIn(
                    ["metadata", "papermill", "status"],
                    null
                  );

                  return (
                    <Cell key={cellId}>
                      <PapermillView status={papermillStatus} />
                      <Input hidden={sourceHidden}>
                        <Prompt
                          counter={cell.get("execution_count")}
                          running={papermillStatus === "running"}
                        />
                        <Source
                          language={language as string}
                          theme={this.props.theme}
                        >
                          {source}
                        </Source>
                      </Input>
                      <Outputs
                        hidden={outputHidden}
                        expanded={cell.getIn(
                          ["metadata", "outputExpanded"],
                          true
                        )}
                      >
                        <Display
                          outputs={cell.get("outputs").toJS()}
                          transforms={this.props.transforms}
                          displayOrder={this.props.displayOrder}
                        />
                      </Outputs>
                    </Cell>
                  );
                case "markdown":
                  return (
                    <Cell key={cellId}>
                      <ContentMargin>
                        <Markdown source={source} />
                      </ContentMargin>
                    </Cell>
                  );
                case "raw":
                  return (
                    <Cell key={cellId}>
                      <RawCell>{source}</RawCell>
                    </Cell>
                  );

                default:
                  return (
                    <Cell key={cellId}>
                      <Outputs>
                        <pre>{`Cell Type "${cellType}" is not implemented`}</pre>
                      </Outputs>
                    </Cell>
                  );
              }
            })}
          </Cells>
          {this.props.theme === "dark" ? <Themes.dark /> : <Themes.light />}
        </div>
      </MathJax.Provider>
    );
  }
}

export default NotebookPreview;
