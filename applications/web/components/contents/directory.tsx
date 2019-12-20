import { NewNotebookNavigation } from "@nteract/connected-components";
import {
  AppState,
  ContentRef,
  DirectoryContentRecord,
  JupyterHostRecord,
  KernelspecProps,
  KernelspecRecord,
  selectors
} from "@nteract/core";
import {
  Entry,
  Icon,
  LastSaved,
  Listing,
  Name
} from "@nteract/directory-listing";
import * as React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import urljoin from "url-join";

import { openNotebook } from "../triggers/open-notebook";

const ListingRoot = styled.div`
  margin-top: 2rem;
  padding-left: 2rem;
  padding-right: 2rem;
`;

interface LightDirectoryEntry {
  last_modified: Date | null;
  name: string;
  path: string;
  type: "notebook" | "dummy" | "directory" | "file" | "unknown";
}

type LightDirectoryEntries = LightDirectoryEntry[];

interface DirectoryProps {
  appBase: string;
  content: DirectoryContentRecord;
  host: JupyterHostRecord;
  appVersion: string;
  contentRef: ContentRef;
  contents: LightDirectoryEntries;
}

export class DirectoryApp extends React.PureComponent<DirectoryProps> {
  render() {
    return (
      <React.Fragment>
        <ListingRoot>
          <Listing>
            {this.props.contents &&
              this.props.contents.map((entry, index) => {
                return (
                  <Entry key={index}>
                    <Icon fileType={entry.type} />
                    <Name>{entry.name}</Name>
                    <LastSaved lastModified={entry.last_modified} />
                  </Entry>
                );
              })}
          </Listing>
        </ListingRoot>
      </React.Fragment>
    );
  }
}

interface InitialProps {
  contentRef: ContentRef;
  appBase: string;
}

const makeMapStateToDirectoryProps = (
  initialState: AppState,
  initialProps: InitialProps
): ((state: AppState) => DirectoryProps) => {
  const { contentRef, appBase } = initialProps;
  const mapStateToDirectoryProps = (state: AppState) => {
    const content = selectors.content(state, initialProps);
    const contents: LightDirectoryEntry[] = [];
    const host = selectors.currentHost(state);

    if (host.type !== "jupyter") {
      throw new Error("This component only works with jupyter servers");
    }

    if (!content || content.type !== "directory") {
      return {};
    }

    content.model.items.map((entryRef: ContentRef) => {
      const row = selectors.content(state, { contentRef: entryRef });
      if (!row) {
        return {
          last_modified: new Date(),
          name: "",
          path: "",
          type: ""
        };
      }

      if (row.type !== "dummy") {
        return null;
      }

      contents.push({
        last_modified: row.lastSaved,
        name: row.filepath,
        path: row.filepath,
        type: row.assumedType
      });
    });

    return {
      appBase,
      appVersion: selectors.appVersion(state),
      content,
      contentRef,
      contents,
      host
    };
  };
  return mapStateToDirectoryProps;
};

export default connect(makeMapStateToDirectoryProps)(DirectoryApp);
