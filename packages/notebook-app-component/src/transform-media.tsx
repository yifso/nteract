import Immutable from "immutable";
import React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";

import { JSONObject } from "@nteract/commutable";
import { actions, selectors } from "@nteract/core";
import { ImmutableOutput } from "@nteract/records";
import { AppState, ContentRef } from "@nteract/types";

interface OwnProps {
  id: string;
  contentRef: ContentRef;
  output: ImmutableOutput;
  index: number;
}

interface Props extends OwnProps {
  mediaActions: {
    updateOutputMetadata: (metadata: JSONObject) => void;
  };
  Media: React.Component;
}

class PureTransformMedia extends React.Component<Props> {
  render() {
    const { Media, mediaActions } = this.props;
    return <Media {...mediaActions} />;
  }
}

const richestMediaType = (
  output: ImmutableOutput,
  order: Immutable.List<string>,
  handlers: any
) => {
  return (
    [...Object.keys(output)]
      // we can only use those we have a transform for
      .filter(mediaType => handlers[mediaType] && order.includes(mediaType))
      // the richest is based on the order in displayOrder
      .sort((a, b) => order.indexOf(a) - order.indexOf(b))[0]
  );
};

const makeMapStateToProps = (
  initialState: AppState,
  initialProps: OwnProps
) => {
  const { output } = initialProps;
  const mapStateToProps = (state: AppState) => {
    const handlers = selectors.transformsById(state);
    const order = selectors.displayOrder(state);
    const mediaType = richestMediaType(output, order, handlers);
    const Media = selectors.transform(state, { id: mediaType });
    return {
      Media,
      mediaType,
      output
    };
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
