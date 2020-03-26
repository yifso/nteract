import { WithRouterProps } from "next/dist/client/with-router";
import { withRouter } from "next/router";

import React, { useState } from "react";
import { Octokit } from "@octokit/rest";

import styled from "styled-components";
import Menu from '../../components/Menu'
import Console from '../../components/Console'
import StatusLine from '../../components/StatusLine'
import BinderMenu from '../../components/BinderMenu'
import FilesListing from "../../components/FilesListing"

import dynamic from "next/dynamic";
import { Host } from "@mybinder/host-cache";

const Binder = dynamic(() => import("../../components/Binder"), {
  ssr: false
});

const BINDER_URL = "https://mybinder.org";


interface State {
  fileContent: string;
  showConsole: boolean;
  showBinderMenu: boolean;
  provider: string;
  org: string;
  repo: string;
  gitRef: string;
  filepath: string
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

export class Main extends React.PureComponent<WithRouterProps, State> {

  constructor(props) {
    super(props);

    const { params } = this.props.router.query;

    /**
     * Since we use a single file named [...params] to aggregate
     * all of the configurable options passeed into the url, we have
     * to parse the parameters positional based on their position in the
     * URL.
     *
     * The expected URL structire is /{provider}/{org}/{repo}/{ref}/{filepath}.
     */
    const filepathSegments = params.slice(4);
    let filepath;
    if (typeof filepathSegments !== "string") {
      filepath = filepathSegments.join("");
    } else {
      filepath = filepathSegments;
    }

    this.state = {
      fileContent: "",
      showConsole: false,
      showBinderMenu:false,
      provider: params[0],
      org: params[1],
      repo: params[2],
      gitRef: params[3],
      filepath: filepath
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


  render(): JSX.Element {
    const { params } = this.props.router.query;

    /**
     * Since we use a single file named [...params] to aggregate
     * all of the configurable options passeed into the url, we have
     * to parse the parameters positional based on their position in the
     * URL.
     *
     * The expected URL structire is /{provider}/{org}/{repo}/{ref}/{filepath}.
     */
    if (params) {
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
       
          <Host repo={`${this.state.org}/${this.state.repo}`} gitRef={this.state.gitRef} binderURL={BINDER_URL}>
            <Host.Consumer>
              {host => <Binder filepath={this.state.filepath} host={host} />}
            </Host.Consumer>
          </Host>
       
        </Body>
        <Footer>
          { this.state.showConsole && <Console></Console> }
            <StatusLine toggleConsole={this.toggleConsole}></StatusLine>
        </Footer>
      </Layout>
      );
    }
    return null;
  }
}

export default withRouter(Main);
