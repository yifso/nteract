import React, {useState, useEffect} from "react";
import {Octokit} from "@octokit/rest";
import {Dispatch} from "redux";
import Store from "../redux/store";
import {connect} from "react-redux";
import {
  AppState,
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
import {contentRefByFilepath} from "@nteract/selectors";
import {createNotebookModel, createSuccessAjaxResponse} from "../util/helpers"

type ComponentProps = {
  filepath: string,
  getContent: (x : string) => Promise<any>,
  host: ServerConfig
}

interface DispatchProps {
  setAppHost: (host : HostRecord) => void;
  fetchContentFulfilled: (filepath : string, model : any, contentRef : ContentRef, kernelRef : KernelRef) => void;
}

type StateProps = {
  contentRef: string
}

type Props = ComponentProps & DispatchProps & StateProps;

const makeMapStateToProps = (initialState : AppState, ownProps : ComponentProps) => {
  const mapStateToProps = (state : AppState, ownProps : ComponentProps): StateProps => {
    const {filepath} = ownProps
    const ref = contentRefByFilepath(state, {filepath: filepath})
    return {contentRef: ref}
  }

  return mapStateToProps
};

const mapDispatchToProps = (dispatch : Dispatch) => ({
  setAppHost: (host : HostRecord) => dispatch(actions.setAppHost({host})),
  fetchContentFulfilled: (filepath : string, model : any, contentRef : ContentRef, kernelRef : KernelRef) => dispatch(actions.fetchContentFulfilled({filepath, model, contentRef, kernelRef}))
});

const Binder = (props : Props) => {
  const [contentFlag, setContentFlag] = useState(false)
  const [contentRef, setContentRef] = useState("")
  const [kernelRef, setKernelRef] = useState("")
  const {filepath} = props
  const preContentRef = props.contentRef
  const octokit = new Octokit()
  // We need to fetch content again as the filePath has been updated
  useEffect(() => {
    if (preContentRef === undefined) {
      // Since contentRef for filepath is undefined
      // We generate new contentRef and use that
      const cr = createContentRef()
      const kr = createKernelRef()
      setContentRef(cr)
      setKernelRef(kr)

      // Get content from github
      props.getContent(filepath).then(({data}) => {
        const content = atob(data['content'])
        const notebook = createNotebookModel(filepath, content);
        const response = createSuccessAjaxResponse(notebook);
        // Set content in store
        props.fetchContentFulfilled(filepath, notebook, cr, kr);
        setContentFlag(true)
      })
    } else {
      setContentRef(preContentRef)
      setContentFlag(true)
    }

  }, [filepath])

  // Once the host is set, add it
  useEffect(() => {
    if (props.host.endpoint != "") {
      props.setAppHost(makeJupyterHostRecord({
        ...props.host,
        origin: props.host.endpoint
      }));
    }

  }, [props.host])

  return (<> {
    contentFlag
      ? (<> < NotebookApp contentRef = {
        contentRef
      } /> </>)
      : ""
    } 
  </>
    );
}


// If we want to pass on the default values
Binder.defaultProps = {
  host: {
    crossDomain: true,
    endpoint: "",
    token: "",
  }
}

export default connect(makeMapStateToProps, mapDispatchToProps)(Binder);
