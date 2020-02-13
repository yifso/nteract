import React from "react";
import { Dispatch } from "redux";
import { connect } from "react-redux";

import {
  actions,
  ContentRef,
  KernelRef,
  createContentRef,
  createKernelRef,
  HostRecord,
  makeJupyterHostRecord,
  ServerConfig
} from "@nteract/core";
import NotebookApp from "@nteract/notebook-app-component";

import "@nteract/styles/app.css";

import "@nteract/styles/global-variables.css";

import "@nteract/styles/themes/base.css";
import "@nteract/styles/themes/default.css";

import "codemirror/addon/hint/show-hint.css";
import "codemirror/lib/codemirror.css";

import "@nteract/styles/editor-overrides.css";

interface ComponentProps {
  host: ServerConfig;
  filepath: string;
}

interface StateProps {}

interface DispatchProps {
  setAppHost: (host: HostRecord) => void;
  fetchContent: (
    filepath: string,
    contentRef: ContentRef,
    kernelRef: KernelRef
  ) => void;
}

type Props = ComponentProps & StateProps & DispatchProps;

interface State {
  contentRef: ContentRef;
  kernelRef: KernelRef;
}

class Notebook extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    props.setAppHost(
      makeJupyterHostRecord({ ...props.host, origin: props.host.endpoint })
    );
    this.state = {
      contentRef: createContentRef(),
      kernelRef: createKernelRef()
    };
  }

  componentDidMount() {
    const { filepath } = this.props;
    const { contentRef, kernelRef } = this.state;
    this.props.fetchContent(filepath, contentRef, kernelRef);
  }

  render() {
    if (this.state.contentRef) {
      return <NotebookApp contentRef={this.state.contentRef} />;
    }
    return null;
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  setAppHost: (host: HostRecord) => dispatch(actions.setAppHost({ host })),
  fetchContent: (
    filepath: string,
    contentRef: ContentRef,
    kernelRef: KernelRef
  ) =>
    dispatch(
      actions.fetchContent({ filepath, contentRef, kernelRef, params: {} })
    )
});

export default connect(null, mapDispatchToProps)(Notebook);
