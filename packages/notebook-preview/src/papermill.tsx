import * as React from "react";
import styled from "styled-components";

type PapermillMetadata = {
  status?: "pending" | "running" | "completed";
  // TODO: Acknowledge / use other papermill metadata
};

const PlainPapermillView = (props: PapermillMetadata) => {
  if (!props.status) {
    return null;
  }

  if (props.status === "running") {
    return <div>Executing with Papermill...</div>;
  }
  return null;
};

export const PapermillView = styled(PlainPapermillView)`
  width: 100%;
  background-color: #e8f2ff;
  padding-left: 10px;
  padding-top: 1em;
  padding-bottom: 1em;
  padding-right: 0;
  margin-right: 0;
  box-sizing: border-box;
`;
