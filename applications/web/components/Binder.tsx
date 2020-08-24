import React, { useState, useEffect } from "react";
import { Octokit } from "@octokit/rest";
import { Dispatch } from "redux";
import { ghGetContent } from "../util/github"
import { connect } from "react-redux";
import {
  actions,
  createContentRef,
  createKernelRef,
  ContentRef,
  HostRecord,
  KernelRef,
  makeJupyterHostRecord,
  ServerConfig
} from "@nteract/core";
import NotebookApp from "@nteract/notebook-app-component/lib/notebook-apps/web-draggable";

type ComponentProps = {
  filepath: string,
  getContent: (x: string) => Promise<any>,
  host?: ServerConfig
}

interface DispatchProps {
  setAppHost: (host: HostRecord) => void;
  fetchContent: (
    filepath: string,
    contentRef: ContentRef,
    kernelRef: KernelRef
  ) => void;
}

type Props = ComponentProps & DispatchProps;

type State = {
  contentRef: ContentRef;
  kernelRef: KernelRef;
}

const Binder = (props: Props, state: State) => {
   const [ content, setContent ] = useState("")
   const [ contentRef, setContentRef ] = useState(createContentRef())
   const [ kernelRef, setKernelRef ] = useState(createKernelRef())
   const {filepath} = props
   const octokit = new Octokit()
  
  // We need to fetch content again as the filePath has been updated
  useEffect( () => {
    console.log(filepath) 
    console.log("in Binder component")
    // const { contentRef, kernelRef } = state;
    props.getContent(filepath).then( ({ data }) => {
      setContent(atob(data['content']))
    })

    props.fetchContent(filepath, contentRef, kernelRef);
  }, [filepath])

  // Once the host is set, add it
  useEffect( () => {
    console.log("host changes")  
   /* props.setAppHost(
      makeJupyterHostRecord({ ...props.host, origin: props.host.endpoint })
    );
    */
  }, [props.host])

    return (
      <>
        {state.contentRef ? (
            <>
              <NotebookApp contentRef={state.contentRef} />
            </>
        ) : <>
              {content}
              
        </>}
      </>
    );
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

export default connect(null, mapDispatchToProps)(Binder);

