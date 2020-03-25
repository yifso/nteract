import React, { useState } from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { Octokit } from "@octokit/rest";

import styled from "styled-components";
import Menu from './Menu'
import Console from './Console'
import StatusLine from './StatusLine'
import BinderMenu from './BinderMenu'
import FilesListing from "./FilesListing"

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
import { filepath } from "@nteract/selectors";
import store from "../redux/store";


interface ComponentProps {
  host: ServerConfig;
  filepath: string;
  params: string[] | string;
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
  fileContent: string;
  showConsole: boolean;
  showBinderMenu: boolean;
  provider: string;
  org: string;
  repo: string;
  gitRef: string;
}

const Layout = styled.div`
  min-height: calc(100vh);
  display: grid;
  grid-template-rows: auto 1fr;
  grid-template-columns: 220px auto;
  grid-row-gap:00px;
  grid-column-gap:0px;
  grid-template-areas:
        "side header"
        "side body"
        "footer footer";
  font-size: 14px;
`;

const Header = styled.div`
  grid-area: header;
  min-height:50px;
`;

const Footer = styled.div`
  grid-area:footer;
  min-height:30px;
`;

const Body = styled.div`
  grid-area: body;
  padding:20px;
  max-height:calc(100vh - 100px);
  overflow:auto;
`;

const Side = styled.div`
  grid-area: side;
  background-color:#38023b;
  min-height: 50px;
  color: #fff;

  .nteract-logo {
    width: 80px;
    display: block;
    margin: auto;
    margin-top: 5px;
  }
`

class App extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    /*props.setAppHost(
      makeJupyterHostRecord({ ...props.host, origin: props.host.endpoint })
    );*/
    console.log(props.params)
    this.state = {
      contentRef: createContentRef(),
      kernelRef: createKernelRef(),
      fileContent: "",
      showConsole: false,
      showBinderMenu:false,
      provider: this.props.params[0],
      org: this.props.params[1],
      repo: this.props.params[2],
      gitRef: this.props.params[3],
    };

    this.loadFile = this.loadFile.bind(this);
    this.toggleConsole = this.toggleConsole.bind(this);
    this.toggleBinderMenu = this.toggleBinderMenu.bind(this);
    this.run = this.run.bind(this)
    this.updateBinder = this.updateBinder.bind(this)

    console.log(this.state)
    console.log(props)
  }

  getFileType(type){
    if (type == "file")
      return "file"
    else if (type =="dir")
      return "directory"
  }

  componentDidMount() {
    const { filepath } = this.props;
    const { contentRef, kernelRef } = this.state;
    this.props.fetchContent(filepath, contentRef, kernelRef);
  }
  
  toggleConsole(){
    this.setState({showConsole: !this.state.showConsole})
  }

  toggleBinderMenu(){
    this.setState({showBinderMenu: !this.state.showBinderMenu})
  }

  run(){
    console.log("run binder here")
  }

  loadFile(fileName){
    const octokit = new Octokit()
    octokit.repos.getContents({
      owner: this.state.org,
      repo: this.state.repo,
      path: fileName
    }).then(({data}) => {
      console.log(data)
      this.setState({fileContent: atob(data["content"])})
    })
  }

  updateBinder(provider, organ, repo, gitRef){
    this.setState({
      provider:provider,
      org:organ,
      repo:repo,
      gitRef:gitRef
    })
    event.preventDefault()
  }

  // TODO: Remove or add this line in body { this.state.contentRef ? (<NotebookApp contentRef={this.state.contentRef} />) : "Wating"}
  render() {
      return (
      <Layout>
        <Header>
          <Menu 
              toggleBinderMenu={this.toggleBinderMenu} 
              run={this.run}>    
          </Menu>
           {this.state.showBinderMenu && 
                  <BinderMenu 
                        provider={this.state.provider}
                        org={this.state.org}
                        repo={this.state.repo}
                        gitRef={this.state.gitRef}
                        updateBinder={this.updateBinder}
                        >
                  </BinderMenu> }
        </Header>
        <Side>
            <img
              src="https://media.githubusercontent.com/media/nteract/logos/master/nteract_logo_cube_book/exports/images/png/nteract_logo_wide_clear_space_red_inverted.png"
              alt="nteract logo"
              className="nteract-logo"
            />
            <FilesListing 
                  loadFile={this.loadFile} 
                  org={this.state.org} 
                  repo={this.state.repo}
                  gitRef={this.state.gitRef}>
            </FilesListing>
            
        </Side>
        <Body>
          {this.state.fileContent}
        </Body>
        <Footer>
          { this.state.showConsole && <Console></Console> }
            <StatusLine toggleConsole={this.toggleConsole}></StatusLine>
        </Footer>
      </Layout>
      );

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

export default connect(null, mapDispatchToProps)(App);
