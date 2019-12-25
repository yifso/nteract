import { AppState, ContentRef, selectors } from "@nteract/core";
import React from "react";

import File from "./contents/file";

import { connect } from "react-redux";
import Directory from "./contents/directory";

import BinderConsole from "./binder-console";
import BinderHeader from "./binder-header";

import { createGlobalStyle } from "styled-components";

interface StateProps {
  directoryRef: string;
  contentRef: string;
}

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0px;
  }
`;

class App extends React.Component<StateProps> {
  shouldComponentUpdate(nextProps: StateProps): boolean {
    return (
      nextProps.contentRef !== this.props.contentRef ||
      nextProps.directoryRef !== this.props.directoryRef
    );
  }

  render(): JSX.Element {
    return (
      <React.Fragment>
        <BinderHeader />
        <BinderConsole />
        <Directory contentRef={this.props.directoryRef} />
        <File contentRef={this.props.contentRef} />
        <GlobalStyle />
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state: AppState) => {
  const directoryRef = selectors.contentRefByFilepath(state, {
    filepath: "/"
  });

  const contentRef = selectors.contentRefByFilepath(state, {
    filepath: state.webApp.get("activeFile")
  });

  return {
    directoryRef,
    contentRef
  };
};

export default connect(mapStateToProps)(App);
