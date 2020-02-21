import React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";

import {
  actions,
  ContentRef,
  createContentRef,
  createKernelRef,
  HostRecord,
  KernelRef,
  makeJupyterHostRecord,
  ServerConfig
} from "@nteract/core";
import NotebookApp from "@nteract/notebook-app-component";

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
