import React from "react";
import { connect } from "react-redux";
import Immutable from "immutable";

import { selectors, ContentRef, AppState } from "@nteract/core";

import styled from "styled-components";

interface ComponentProps {
    id: string;
    contentRef: ContentRef;
}

interface StateProps {
    tags: Immutable.Set<string>;
}


type Props = ComponentProps & StateProps;

const Banner = styled.div`
  background-color: darkblue;
  color: ghostwhite;
  padding: 9px 16px;
  font-size: 12px;
  line-height: 20px;
`;

Banner.displayName = "CellBanner";

export class CellBanner extends React.Component<Props> {
    render() {
        return <>
            {this.props.tags?.has("parameters") ? (
                <Banner>Papermill - Parametrized</Banner>
            ) : null}
            {this.props.tags?.has("default parameters") ? (
                <Banner>Papermill - Default Parameters</Banner>
            ) : null}
        </>;
    }
}

const makeMapStateToProps = (
    initialState: AppState,
    ownProps: ComponentProps
) => {
    const mapStateToProps = (state: AppState) => {
        const { id, contentRef } = ownProps;
        const model = selectors.model(state, { contentRef });
        let tags = Immutable.Set<string>();

        if (model && model.type === "notebook") {
            const cellMap = selectors.notebook.cellMap(model);
            const cell = cellMap.get(ownProps.id);
            if (cell) {
                tags = cell.getIn(["metadata", "tags"]);
            }
        }

        return {
            tags
        };
    };
    return mapStateToProps;
};

export default connect(
    makeMapStateToProps
)(CellBanner);
