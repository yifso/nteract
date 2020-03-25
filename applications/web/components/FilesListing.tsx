import * as React from "react";
import { Octokit } from "@octokit/rest";
import { generate } from 'shortid';
import { Listing, Icon, Name, LastSaved, Entry} from "@nteract/directory-listing";

import styled from "styled-components";

type Props = {
  loadFile: any
};

interface State {
  files:any;
}

const FilesListingDiv = styled.div`
  font-size:12px;
  margin-top:30px;

  .tag{
    margin-left: 10px;
    font-weight:bold;
    margin-bottom:5px;
  }

  ul{
    margin:0px;
    padding:0px;
    list-style:none;
    height: 500px;
    overflow:auto;
  }

  li{
    padding-left:25px;
    height:25px;
    line-height:25px;
    cursor:pointer;
    font-size:12px;
  }

  li:hover{
    background-color:#79037f;
  }

  .icon{
    font-size:8px;
    margin-right:3px;
  }

`;

export default class FilesListing extends React.Component<Props,State> {
    constructor(props){
        super(props);

        this.state = {
          files: [],
        };
    }

  getFileType(type){
      if (type == "file")
        return "file"
      else if (type =="dir")
        return "directory"
  }
    
  componentDidMount() {

    const octokit = new Octokit()
    octokit.repos.getContents({
      owner: "nteract",
      repo: "examples",
      path: ""
    }).then(({data}) => {
      console.log(data)
      this.setState({files: data})
    })


  }


    render() {
      return (
        <FilesListingDiv>  
              <div className="tag">Explorer</div>
          <ul>
            {
              this.state.files.map((file)=> 
                  <li key={generate()} onClick={() => this.props.loadFile(file.name)}>
                     <span className="icon"><Icon fileType={this.getFileType(file.type)} color="#fff" /></span> {file.name}
                  </li>
              )
            }
          </ul>
        </FilesListingDiv>    
      );
    }
  } 
