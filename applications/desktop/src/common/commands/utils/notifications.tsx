import { Breadcrumbs } from "@blueprintjs/core";
import { openExternalFile } from "@nteract/mythic-windowing";
import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";

const Spacer = styled.div`
  height: 30px;
`;

const NoWrap = styled.div`
  white-space: nowrap;
  position: absolute;
  width: 250px;
  
  * { 
    font-size: 14px !important;
    background: transparent !important;
  }
  
  li::after { margin: 0 3px !important; }
`;

// Show the user the most important parts of the file path, as much as
// they have space in the message.
export const FilePathMessage =
  connect(
    undefined,
    dispatch => ({
      openExternalFile:
        (filepath: string) => dispatch(openExternalFile.create(filepath)),
    }),
  )(
    (props: { filepath: string, openExternalFile: (filepath: string) => void }) =>
    <>
      <NoWrap>
        <Breadcrumbs items={props.filepath.split("/").map((each, i) => ({
          text: each,
          icon: i === props.filepath.split("/").length - 1
            ? "document"
            : "folder-close",
          onClick: i === props.filepath.split("/").length - 1
            ? () => props.openExternalFile(props.filepath)
            : undefined
        }))}/>
      </NoWrap>
      <Spacer/>
    </>
  );
