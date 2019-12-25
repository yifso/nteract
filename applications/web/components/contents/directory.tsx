import { NewNotebookNavigation } from "@nteract/connected-components";
import {
  AppState,
  ContentRef,
  DirectoryContentRecord,
  JupyterHostRecord,
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
import { Dispatch } from "redux";
import styled from "styled-components";

import * as actions from "../../redux/actions";

const ListingRoot = styled.div`
  margin-top: 2rem;
  padding-left: 2rem;
  padding-right: 2rem;
  background-color: pink;
`;

interface LightDirectoryEntry {
  last_modified: Date | null;
  name: string;
  path: string;
  type: "notebook" | "dummy" | "directory" | "file" | "unknown";
}

type LightDirectoryEntries = LightDirectoryEntry[];

interface DirectoryProps {
  content: DirectoryContentRecord;
  contentRef: ContentRef;
  contents: LightDirectoryEntries;
}

export class DirectoryApp extends React.Component<DirectoryProps> {
  render() {
    console.log(this.props);
    return (
      <React.Fragment>
        <ListingRoot>
          <Listing>
            {this.props.contents &&
              this.props.contents.map((entry, index) => {
                return (
                  <Entry
                    key={index}
                    onClick={() => this.props.setFile(entry.path)}
                  >
                    <Icon
                      fileType={entry.type}
                      onClick={() => this.props.setFile(entry.path)}
                    />
                    <Name onClick={() => this.props.setFile(entry.path)}>
                      {entry.name}
                    </Name>
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
}

const mapStateToProps = (state: AppState, initialProps: InitialProps) => {
  const { contentRef } = initialProps;
  const content = selectors.content(state, { contentRef });
  const contents: LightDirectoryEntry[] = [];

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
    content,
    contentRef,
    contents
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  setFile: (contentRef: string) => {
    console.log(contentRef);
    dispatch(actions.setFile(contentRef));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(DirectoryApp);
