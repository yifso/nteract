import React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";

import { JSONObject } from "@nteract/commutable";
import { actions, selectors } from "@nteract/core";
import { AppState, ContentRef } from "@nteract/types";

interface OwnProps {
  id: string;
  contentRef: ContentRef;
  index: number;
}

interface Props extends OwnProps {
  mediaActions: {
    updateOutputMetadata: (index: number, metadata: JSONObject) => void;
  };
  Media: React.Component;
}

class PureTransformMedia extends React.Component<Props> {
  render() {
    const { Media, mediaActions } = this.props;
    return <Media {...mediaActions} />;
  }
}

const makeMapStateToProps = (
  initialState: AppState,
  initialProps: OwnProps
) => {
  const { id, index, contentRef } = initialProps;
  const mapStateToProps = (state: AppState) => {
    const model = selectors.model(state, { contentRef });
    if (model) {
      const cell = selectors.notebook.cellById(model, id);
      if (cell) {
        const output = cell.get("outputs").get(index);
        const mediaType = richestMediaType(output);
        const Media = selectors.transform(state, { id: mediaType });
        return {
          Media,
          mediaType,
          output
        };
      }
    }

    return {};
  };
  return mapStateToProps;
};

const makeMapDispatchToProps = (
  initialDispath: Dispatch,
  initialProps: OwnProps
) => {
  const { id, contentRef, index } = initialProps;
  const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
      mediaActions: {
        updateOutputMetadata: (metadata: JSONObject) => {
          dispatch(
            actions.updateOutputMetadata({ id, contentRef, metadata, index })
          );
        }
      }
    };
  };
  return mapDispatchToProps;
};

const TransformMedia = connect(
  makeMapStateToProps,
  makeMapDispatchToProps
)(PureTransformMedia);

export default TransformMedia;
