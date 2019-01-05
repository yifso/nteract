import * as React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import urljoin from "url-join";
import { NewNotebookNavigation } from "@nteract/connected-components";
import {
  Entry,
  Listing,
  Icon,
  Name,
  LastSaved
} from "@nteract/directory-listing";
import {
  selectors,
  AppState,
  KernelspecRecord,
  KernelspecProps,
  JupyterHostRecord,
  ContentRef,
  DirectoryContentRecord
} from "@nteract/core";

import { openNotebook } from "../triggers/open-notebook";

const ListingRoot = styled.div`
  margin-top: 2rem;
  padding-left: 2rem;
  padding-right: 2rem;
`;

type LightDirectoryEntry = {
  last_modified: Date | null;
  name: string;
  path: string;
  type: "notebook" | "dummy" | "directory" | "file" | "unknown";
};

type LightDirectoryEntries = LightDirectoryEntry[];

type DirectoryProps = {
  appBase: string;
  content: DirectoryContentRecord;
  host: JupyterHostRecord;
  appVersion: string;
  contentRef: ContentRef;
  contents: LightDirectoryEntries;
};

export class DirectoryApp extends React.PureComponent<DirectoryProps> {
  openNotebook = (ks: KernelspecRecord | KernelspecProps) => {
    openNotebook(this.props.host, ks, {
      appBase: this.props.appBase,
      appVersion: this.props.appVersion,
      // Since we're looking at a directory, the base dir is the directory we are in
      baseDir: this.props.content.filepath
    });
  };

  render() {
    const atRoot = this.props.content.filepath === "/";
    const dotdothref = urljoin(
      this.props.appBase,
      // Make sure leading / and .. don't navigate outside of the appBase
      urljoin(this.props.content.filepath, "..")
    );
    const dotdotlink = (
      <a href={dotdothref} title="Navigate down a directory" role="button">
        {".."}
      </a>
    );

    return (
      <React.Fragment>
        <NewNotebookNavigation onClick={this.openNotebook} />
        <ListingRoot>
          <Listing>
            {atRoot ? null : (
              // TODO: Create a contentRef for `..`, even though it's a placeholder
              // When we're not at the root of the tree, show `..`
              <Entry>
                <Icon fileType={"directory"} />
                <Name>{dotdotlink}</Name>
              </Entry>
            )}
            {this.props.contents.map((entry, index) => {
              const link = (
                <a
                  href={urljoin(this.props.appBase, entry.path)}
                  // When it's a notebook, we open a new tab
                  target={entry.type === "notebook" ? "_blank" : undefined}
                >
                  {entry.name}
                </a>
              );

              return (
                <Entry key={index}>
                  <Icon fileType={entry.type} />
                  <Name>{link}</Name>
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

const mapStateToDirectoryProps = (
  state: AppState,
  ownProps: { contentRef: ContentRef; appBase: string }
): DirectoryProps => {
  const { contentRef, appBase } = ownProps;
  const content = selectors.content(state, ownProps);
  const contents: LightDirectoryEntry[] = [];
  const host = selectors.currentHost(state);

  if (host.type !== "jupyter") {
    throw new Error("This component only works with jupyter servers");
  }

  if (!content || content.type !== "directory") {
    throw new Error(
      "The directory component should only be used with directory contents"
    );
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

export const ConnectedDirectory = connect(mapStateToDirectoryProps)(
  DirectoryApp
);

export default ConnectedDirectory;
