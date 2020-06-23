import React, { FC,  HTMLAttributes, useState, useEffect} from "react";
import { WithRouterProps } from "next/dist/client/with-router";
import { withRouter } from "next/router";
import { Octokit } from "@octokit/rest";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay, faSave, faBars, faTerminal, faServer} from '@fortawesome/free-solid-svg-icons'
import { faGithubAlt, faPython } from '@fortawesome/free-brands-svg-icons'

import dynamic from "next/dynamic";
import { Host } from "@mybinder/host-cache";

import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';

import { Menu, MenuItem } from '../../components/Menu'
import { Button } from '../../components/Button'
import { Console } from '../../components/Console'
import { BinderMenu } from '../../components/BinderMenu'
import { Avatar } from '../../components/Avatar'
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

/**
     * Since we use a single file named [...params] to aggregate
     * all of the configurable options passeed into the url, we have
     * to parse the parameters positional based on their position in the
     * URL.
     *
     * The expected URL structire is /{provider}/{org}/{repo}/{ref}/{filepath}.
     */

function getFilePath(params){
    const filepathSegments = params.slice(4);
    let filepath;
    if (typeof filepathSegments !== "string") {
      filepath = filepathSegments.join("");
    } else {
      filepath = filepathSegments;
    }
  
    return filepath
  }

function getFileType(type){
    if (type == "file")
      return "file"
    else if (type =="dir")
      return "directory"
  }


export interface Props extends HTMLAttributes<HTMLDivElement> {
  router: any
  }

export const Main: FC<WithRouterProps> = (props: Props) => {

    const { params } = props.router.query;
    
    const [ showBinderMenu, setShowBinderMenu ] = useState(false)
    const [ showConsole, setShowConsole ] = useState(false)
    
    const [ fileContent, setFileContent ] = useState("")
    const [ fileType, setFileType ] = useState("")
    const [ provider, setProvider ] = useState(params[0])
    const [ org, setOrg ] = useState(params[1])
    const [ repo, setRepo ] = useState(params[2])
    const [ gitRef, setGitRef ] = useState(params[3])
    const [ filepath, setFilepath ] = useState(getFilePath(params))
    
    const [ loggedIn, setLoggedIn ] = useState(false)
    const [ username, setUsername ] = useState("")
    const [ userImage, setUserImage ] = useState("")
    const [ userLink, setUserLink ] = useState("")
   
// This Effect runs only when the username change
useEffect( () => {
  // Check if user has a token saved
  if ( localStorage.getItem("token") != undefined ){
        getGithubUserDetails()
  }
}, [username])
  
 function toggle( value, setFunction){
   setFunction(!value)
  }

  function run(){
    console.log("run binder here")
  }

  function onSave(){
    console.log("on github save")
  }

 function  loadFile(fileName){
    const octokit = new Octokit()
    octokit.repos.getContents({
      owner: org,
      repo: repo,
      path: fileName
    }).then(({data}) => {
      if(data['type'] == "file"){
        /* TODO: Add file rendering in nteract/web
           Rendering can have two cases:

           - We want to render a notebook; It can be edited and changes should be sent to the binder instance.
           - We want to render any other file type; we can keep it read only.
        */
        setFileContent( atob(data["content"]) )
        /* TODO: Further, check if its a notebook or note, and render them differently. */
      }else{
       /* TODO: Add folder listing in nteract/web
          when user click on a folder, it should show the sub file and folders.
       */
        console.log(username)
      }
    })
  }

  function updateVCSInfo(event, provider, org, repo, gitRef){
    setProvider(provider)
    setOrg(org)
    setRepo(repo)
    setGitRef(gitRef)
    event.preventDefault()
  }

 function  oauthGithub(){
   if ( localStorage.getItem("token") == undefined ){
        window.open('https://github.com/login/oauth/authorize?client_id=83370967af4ee7984ea7&scope=repo,read:user&state=23DF32sdGc12e', '_blank');
   }else{
        getGithubUserDetails()
   }
  }

  function getGithubUserDetails(){
    const token = localStorage.getItem("token") 
        fetch("https://api.github.com/user", {
          method: "GET",
          headers: new Headers({
            "Authorization": "token " + token
          })
          
        })
        .then( (res) => res.json())
        .then( (data) => {
          if( data["login"] !== undefined) {
            setLoggedIn(true)
            setUsername(data["login"])
            setUserLink(data["html_url"])
            setUserImage(data["avatar_url"])
          }else{
            // Login failed | also give notification here
            localStorage.removeItem("token")
          }
        })
  }


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
             showBinderMenu &&
                  
               <BinderMenu
                        provider={provider}
                        org={org}
                        repo={repo}
                        gitRef={gitRef}
                        updateVCSInfo={updateVCSInfo}
                        style={{
                                height: "150px",
                                position: "absolute",
                                marginTop: "51px",
                                width: "calc(100% - 260px)",
                                right: "0px",
                                borderBottom: "1px solid #FBECEC",
                           }}
                        />
           }
        
          { 
            showConsole && <Console style={{ 
                               position: "absolute",
                               bottom: "30px",
                               right: "0px",
                               width: "calc(100% - 260px)"
                 }}>Console</Console> 
          }

        <Header>
          <Menu>
              <MenuItem>
                    <Button text="Run" variant="outlined" icon={runIcon} onClick={() => run()}/>
              </MenuItem>
            { loggedIn &&
              <MenuItem>
                    <Button text="Save" variant="outlined" icon={saveIcon} onClick={() => onSave()}/>
              </MenuItem>
            }

              <MenuItem>
                    <Button text="Menu" variant="outlined" icon={menuIcon} onClick={() => toggle( showBinderMenu, setShowBinderMenu)}/>
              </MenuItem>

          </Menu>
            <Menu>
              <MenuItem >
                    { loggedIn
                          ? <Avatar userImage={userImage} username={username} userLink={userLink} / >
                          : <Button onClick={ () => oauthGithub()} text="Connect to Github" icon={githubIcon} />
                    }
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
                  loadFile={loadFile}
                  org={org}
                  repo={repo}
                  gitRef={gitRef}>
            </FilesListing>
        </Side>
        <Body>
              <Editor
                  value={fileContent}
                  placeholder="Empty File..."
                  className="language-javascript"
                 onValueChange={ code => setFileContent(code) }
                        highlight={code => highlight(code, languages.javascript, "javascript")}
                        padding={30}
                        style={{
                          fontFamily: ' "Fira Mode", "Fira cono", monospace',
                          fontSize: 12,
                          backgroundColor: "#fff" 
                        }}
              />
        </Body>

        <Footer>

            <Menu>
                <MenuItem>
                  <Button text="Console" icon={consoleIcon} variant="transparent" onClick={() => toggle(showConsole, setShowConsole)}/>
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

export default withRouter(Main);
