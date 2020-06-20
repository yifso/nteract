import React, { FC , useEffect, useState } from "react";
import styled from "styled-components";

export const Main: FC = () => {
const [ code, setCode ] = useState("")
const [ codeState, setCodeState ] = useState("")
const [ auth, setAuth ] = useState(false)

const Message = styled.div`
    width:600px;
    padding: 30px;
    font-size: 14px;
    font-family: roboto;
    justify-self: center;
    position: absolute;
    top: 200px;
    left: 50%;
    margin-left: -300px;
    background-color: #f2f2f2;
    border-radius: 4px;
`


useEffect( () =>{
 const params = new URLSearchParams(window.location.search)
 setCode(params.get("code"))
 setCodeState(params.get("state"))
})

useEffect( () => {
  if( code !== "" && codeState !== "") {
    oauthGithub()
  }
}, [code, codeState])

const oauthGithub = () => {
  fetch(`https://play-oauth-server-gjjwxcr82.vercel.app/github?code=${code}&state=${codeState}`)
   .then(res => res.json())
   .then(data => { 
     if ( data.access_token !== undefined){
        localStorage.setItem("token", data.access_token)
        setAuth(true)
     }
   })
}
 
return (
        <>
          <Message> 
          { auth 
            ? 
              <>
                <h3>Authentication Successful!</h3>
              
                <p>Go back to the application and click on the 'Connect to Github' button again. You can close this window now.</p>
              </>
             
            : 
                <>
                <h3>Authenticating...</h3>
                </>
            }
          </Message>
        </>
      );
}

export default Main;
