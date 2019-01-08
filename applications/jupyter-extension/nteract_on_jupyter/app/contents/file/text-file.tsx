import * as React from "react";
import styled from "styled-components";
import { actions, AppState, ContentRef, selectors } from "@nteract/core";
import { MonacoEditorProps } from "@nteract/monaco-editor";
import { connect } from "react-redux";
import { Dispatch } from "redux";

const EditorContainer = styled.div`
  position: absolute;
  left: 0;
  height: 100%;
  width: 100%;

  .monaco {
    height: 100%;
  }
`;

type MappedStateProps = {
  mimetype: string;
  text: string;
  contentRef: ContentRef;
  theme: "light" | "dark";
};

type MappedDispatchProps = {
  handleChange: (value: string) => void;
};

type TextFileProps = MappedStateProps & MappedDispatchProps;

type TextFileState = {
  Editor: React.ComponentType<MonacoEditorProps>;
};

class EditorPlaceholder extends React.PureComponent<MonacoEditorProps> {
  render() {
    // TODO: Show a little blocky placeholder
    return null;
  }
}

export class TextFile extends React.PureComponent<
  TextFileProps,
  TextFileState
> {
  constructor(props: TextFileProps) {
    super(props);
    this.state = {
      Editor: EditorPlaceholder
    };
  }

  handleChange(source: string) {
    this.props.handleChange(source);
  }
  componentDidMount() {
    import(/* webpackChunkName: "monaco-editor" */ "@nteract/monaco-editor").then(
      module => {
        this.setState({ Editor: module.default });
      }
    );
  }
  render() {
    const Editor = this.state.Editor;

    return (
      <EditorContainer className="nteract-editor">
        <Editor
          theme={this.props.theme === "dark" ? "vs-dark" : "vs"}
          mode={this.props.mimetype}
          editorFocused={true}
          value={this.props.text}
          onChange={this.handleChange.bind(this)}
        />
      </EditorContainer>
    );
  }
}

type OwnProps = {
  contentRef: ContentRef;
};

function mapStateToTextFileProps(
  state: AppState,
  ownProps: OwnProps
): MappedStateProps {
  const content = selectors.content(state, ownProps);
  if (!content || content.type !== "file") {
    throw new Error("The text file component must have content");
  }

  const text = content.model ? content.model.text : "";

  return {
    contentRef: ownProps.contentRef,
    mimetype: content.mimetype != null ? content.mimetype : "text/plain",
    text,
    theme: selectors.currentTheme(state)
  };
}

const mapDispatchToTextFileProps = (
  dispatch: Dispatch,
  ownProps: OwnProps
): MappedDispatchProps => ({
  handleChange: (source: string) => {
    dispatch(
      actions.updateFileText({
        contentRef: ownProps.contentRef,
        text: source
      })
    );
  }
});

const ConnectedTextFile = connect<
  MappedStateProps,
  MappedDispatchProps,
  OwnProps,
  AppState
>(
  mapStateToTextFileProps,
  mapDispatchToTextFileProps
)(TextFile);

export function handles(mimetype: string) {
  return (
    mimetype.startsWith("text/") ||
    mimetype.startsWith("application/javascript") ||
    mimetype.startsWith("application/json")
  );
}

export default ConnectedTextFile;
