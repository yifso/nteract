import React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";

import { Menu } from './Menu'

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

class Main extends React.Component<Props, State> {
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
      return (<span>
      <Menu></Menu>
      <NotebookApp contentRef={this.state.contentRef} />
      </span>
      );
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

export default connect(null, mapDispatchToProps)(Main);
