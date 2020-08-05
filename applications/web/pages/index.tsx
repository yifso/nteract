import React, { FC } from "react";
import styled from "styled-components";
import { BinderMenu } from "../components/BinderMenu"
import { H3, P } from "../components/Layout"
import Head from "next/head";

const Box = styled.div`
  display: flex;
   align-items: center;
  flex-direction: column;
`

const Logo = styled.img`
  width: 220px;
  margin-top:120px;
`

const customStyle = {
    height: "150px",
    width: "1050px",
    background: "#f5f2f7",
    border: "1px solid #e6e0ea",
    marginTop: "120px",
    borderRadius: "4px",
}

export const Main: FC<HTMLDivElement> = () => {
 
function updateVCSInfo(e: React.FormEvent<HTMLFormElement>, provider: string | undefined, org: string | undefined, repo: string | undefined, gitRef: string | undefined){
    const url = `${window.location.href}p/${provider}/${org}/${repo}/${gitRef}`
    window.open(url, "_self");
    e.preventDefault()
}

return (
  <>
          <Head>
             <title>nteract web: Run interactive code</title> 
             <meta charSet="utf-8" />
             <meta name="viewport" content="initial-scale=1.0, width=device-width" />
          </Head>

  <Box>

    <Logo src="https://media.githubusercontent.com/media/nteract/logos/master/nteract_logo_cube_book/exports/images/png/nteract_logo_wide_clear_space_purple.png" alt="nteract logo" />
        
        <P> 
          Welcome to <b>nteract web</b>. It&apos;s an interactive playground for users to connect to kernels hosted on <a href="https://mybinder.org/" title="Binder" >MyBinder</a> and run code samples against it. It allows you to run notebooks online in seconds and share it with your audience/colleagues/students. 
        </P>

              <BinderMenu
                        provider="gh"
                        org="nteract"
                        repo="examples"
                        gitRef="master"
                        updateVCSInfo={updateVCSInfo}
                        style={customStyle}
              />


  </Box>
  </>
      );
}

/*
 TODO: We need to add nteract logo and few instructions here about the application, this is the landing page.
 */

export default Main
