import { WithRouterProps } from "next/dist/client/with-router";
import { withRouter } from "next/router";
import React, { useState } from "react";
import { Octokit } from "@octokit/rest";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay, faSave, faBars, faTerminal, faServer} from '@fortawesome/free-solid-svg-icons'
import { faGithubAlt, faPython } from '@fortawesome/free-brands-svg-icons'
import dynamic from "next/dynamic";
import { Host } from "@mybinder/host-cache";

import { Menu, MenuItem } from '../../components/Menu'
import { Button } from '../../components/Button'
import { Console } from '../../components/Console'
import { BinderMenu } from '../../components/BinderMenu'
import FilesListing from "../../components/FilesListing"
import { Layout, Header, Body, Side, Footer} from "../../components/Layout"

const runIcon =  <FontAwesomeIcon icon={faPlay} />
const saveIcon =  <FontAwesomeIcon icon={faSave} />
const menuIcon =  <FontAwesomeIcon icon={faBars} />
const githubIcon =  <FontAwesomeIcon icon={faGithubAlt} />
const consoleIcon =  <FontAwesomeIcon icon={faTerminal} />
const pythonIcon =  <FontAwesomeIcon icon={faPython} />
const serverIcon =  <FontAwesomeIcon icon={faServer} />

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

/**
     * Since we use a single file named [...params] to aggregate
     * all of the configurable options passeed into the url, we have
     * to parse the parameters positional based on their position in the
     * URL.
     *
     * The expected URL structire is /{provider}/{org}/{repo}/{ref}/{filepath}.
     */

export class Main extends React.PureComponent<WithRouterProps, State> {

  constructor(props) {
    super(props);
    const { params } = this.props.router.query;
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
    this.updateVCSInfo = this.updateVCSInfo.bind(this)
    this.oauthGithub = this.oauthGithub.bind(this)
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
      if(data['type'] == "file"){
        /* TODO: Add file rendering in nteract/web
           Rendering can have two cases:

           - We want to render a notebook; It can be edited and changes should be sent to the binder instance.
           - We want to render any other file type; we can keep it read only.
        */
           this.setState({fileContent: atob(data["content"])})
      }else{
       /* TODO: Add folder listing in nteract/web
          when user click on a folder, it should show the sub file and folders.
       */
        console.log('Folder Type')
      }
      console.log(data)
    })
  }

  updateVCSInfo(event, provider, organ, repo, gitRef){
    this.setState({
      provider:provider,
      org:organ,
      repo:repo,
      gitRef:gitRef
    })
    event.preventDefault()
  }

  oauthGithub(){
   if ( localStorage.getItem("token") == undefined ){
    window.open('https://github.com/login/oauth/authorize?client_id=83370967af4ee7984ea7&scope=repo,read:user&state=23DF32sdGc12e', '_blank');
    console.log(localStorage.getItem("token"))
   }else{
        const token = localStorage.getItem("token") 
        fetch("https://api.github.com/user", {
          method: "GET",
          headers: new Headers({
            "Authorization": "token " + token
          })
          
        })
        .then( (res) => res.json())
        .then( (data) => console.log(data))
   }
  }


  render(): JSX.Element {
    const { params } = this.props.router.query;
    // We won't be following this logic, we will render the data from github and only send changes to binder  
     /*
       <Host repo={`${this.state.org}/${this.state.repo}`} gitRef={this.state.gitRef} binderURL={BINDER_URL}>
         <Host.Consumer>
           {host => <Binder filepath={this.state.filepath} host={host} />}
         </Host.Consumer>
       </Host>
       */

      return (
        <Layout>
           {
             this.state.showBinderMenu &&
                  
               <BinderMenu
                        provider={this.state.provider}
                        org={this.state.org}
                        repo={this.state.repo}
                        gitRef={this.state.gitRef}
                        updateVCSInfo={this.updateVCSInfo}
                        style={{
                                height: "150px",
                                position: "absolute",
                                marginTop: "50px",
                                width: "calc(100% - 260px)",
                                right: "0px",
                                borderBottom: "1px solid #FBECEC",
                           }}
                        />
           }
        
          { 
            this.state.showConsole && <Console style={{ 
                               position: "absolute",
                               bottom: "30px",
                               right: "0px",
                               width: "calc(100% - 260px)"
                 }}>Console</Console> 
          }

        <Header>
          <Menu>
              <MenuItem>
                    <Button text="Run" variant="outlined" icon={runIcon} onClick={() => this.run()}/>
              </MenuItem>
              <MenuItem>
                    <Button text="Menu" variant="outlined" icon={menuIcon} onClick={() => this.toggleBinderMenu()}/>
              </MenuItem>

          </Menu>
            <Menu>
                  <MenuItem>
                    <Button onClick={ () => this.oauthGithub()} text="Connect to Github" icon={githubIcon} />
                  </MenuItem>
            </Menu>
        </Header>
        <Side>
            <img
              src="https://media.githubusercontent.com/media/nteract/logos/master/nteract_logo_cube_book/exports/images/png/nteract_logo_wide_clear_space_purple.png"
              alt="nteract logo"
              className="logo"
            />
            <FilesListing
                  loadFile={this.loadFile}
                  org={this.state.org}
                  repo={this.state.repo}
                  gitRef={this.state.gitRef}>
            </FilesListing>
        </Side>
        <Body>

        </Body>

        <Footer>

            <Menu>
                <MenuItem>
                      <Button text="Console" icon={consoleIcon} variant="transparent" onClick={this.toggleConsole}/>
                </MenuItem>
                <MenuItem>
                      <Button text="Python 3" icon={pythonIcon} variant="transparent" disabled />
                </MenuItem>
                <MenuItem>
                      <Button text="Idle" icon={serverIcon} variant="transparent" disabled/>
                </MenuItem>
            </Menu>
            <Menu>
              <MenuItem>
                Last Saved Never
                </MenuItem>
            </Menu>
        </Footer>
      </Layout>
      );
  }
}

export default withRouter(Main);
