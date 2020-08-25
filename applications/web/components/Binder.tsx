import React, { useState, useEffect } from "react";
import { Octokit } from "@octokit/rest";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { AjaxResponse } from "rxjs/ajax";
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
import { IContent } from "@nteract/types";
import NotebookApp from "@nteract/notebook-app-component/lib/notebook-apps/web-draggable";

type ComponentProps = {
  filepath: string,
  getContent: (x: string) => Promise<any>,
  host?: ServerConfig
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


function createNotebookModel(filePath: string,  content?: string): IContent<"notebook"> {
      const name = filePath
      // tslint:disable-next-line no-bitwise
      const writable = true
      const created = ""
      // tslint:disable-next-line variable-name -- jupyter camel case naming convention for API
      const last_modified = ""

        return {
                name,
                path: filePath,
                type: "notebook",
                writable,
                created,
                last_modified,
                mimetype: "application/x-ipynb+json",
                content: content ? JSON.parse(content) : null,
                format: "json"
              };
      }

function createSuccessAjaxResponse(notebook: IContent<"notebook">): AjaxResponse {
      return {
              originalEvent: new Event("no-op"),
              xhr: new XMLHttpRequest(),
              request: {},
              status: 200,
              response: notebook,
              responseText: JSON.stringify(notebook),
              responseType: "json"
            };
    }

const Binder = (props: Props) => {
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
      const content = atob(data['content'])
      setContent(content)
      const notebook = createNotebookModel(filepath, content );
      const response = createSuccessAjaxResponse(notebook);
      props.fetchContentFulfilled(filepath, response, kernelRef, contentRef);

      console.log(contentRef)
      console.log(kernelRef)
      console.log(notebook)
      console.log(response)
    })

  }, [filepath])

  // Once the host is set, add it
  useEffect( () => {
   console.log("Host update. New host below")  
   console.log(props.host)
   props.setAppHost(
      makeJupyterHostRecord({ ...props.host, origin: props.host.endpoint })
    );
  
  }, [props.host])

    return (
      <>
        {contentRef ? (
            <>
              <NotebookApp contentRef={contentRef} />
            </>
        ) : <>
              {content}
              
        </>}
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
  ) => {
    console.log("fetchContentFulfilled dispatch")
    dispatch(
      actions.fetchContentFulfilled({ filepath, model, kernelRef, contentRef  })
    )
  }
});

export default connect(null, mapDispatchToProps)(Binder);

