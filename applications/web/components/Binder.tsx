import React, { useState, useEffect } from "react";
import { Octokit } from "@octokit/rest";
import { Dispatch } from "redux";
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
import { contentRefByFilepath } from "@nteract/selectors";
import { createNotebookModel, createSuccessAjaxResponse } from "../util/helpers"

type ComponentProps = {
  filepath: string,
  getContent: (x: string) => Promise<any>,
  host: ServerConfig
}

interface DispatchProps {
  setAppHost: (host: HostRecord) => void;
  fetchContentFulfilled: (
    filepath: string,
    model: any,
    contentRef: ContentRef,
    kernelRef: KernelRef
  ) => void;
}

type Props = ComponentProps & DispatchProps;



const Binder = (props: Props) => {
   const [ contentFlag, setContentFlag ] = useState(false)
   const [ contentRef, setContentRef ] = useState(createContentRef())
   const [ kernelRef, setKernelRef ] = useState(createKernelRef())
   const {filepath} = props
   const octokit = new Octokit()
  
  // We need to fetch content again as the filePath has been updated
  useEffect( () => {
     /* const cr = createContentRef()
      const kr = createKernelRef() 
      setContentRef(cr)
      setKernelRef(kr) */

    //contentRefByFilepath(state, { filepath: filepath })
    props.getContent(filepath).then( ({ data }) => {
      const content = atob(data['content'])
      const notebook = createNotebookModel(filepath, content );
      const response = createSuccessAjaxResponse(notebook);
      props.fetchContentFulfilled(filepath, notebook, contentRef, kernelRef);
      setContentFlag(true)
    })

  }, [filepath])

  // Once the host is set, add it
  useEffect( () => {
   if( props.host.endpoint != ""  ){
   props.setAppHost(
      makeJupyterHostRecord({ ...props.host, origin: props.host.endpoint })
    );
   }
  
  }, [props.host])

    return (
      <>
        {
          contentFlag ? (
            <>
              <NotebookApp contentRef={contentRef} />
            </>
        ) : "" 
        }
      </>
    );
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  setAppHost: (host: HostRecord) => dispatch(actions.setAppHost({ host })),
  fetchContentFulfilled: (
    filepath: string,
    model: any,
    contentRef: ContentRef,
    kernelRef: KernelRef
  ) => 
    dispatch(
      actions.fetchContentFulfilled({ filepath, model, contentRef, kernelRef  })
    )
});

// If we want to pass on the default values
Binder.defaultProps = {
  host: {
    crossDomain: true,
    endpoint: "",
    token: "",
  }
}

export default connect(null, mapDispatchToProps)(Binder);

