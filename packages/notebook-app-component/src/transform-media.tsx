import Immutable from "immutable";
import React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";

import {
  ImmutableDisplayData,
  ImmutableExecuteResult,
  JSONObject
} from "@nteract/commutable";
import { actions, selectors } from "@nteract/core";
import { AppState, ContentRef } from "@nteract/types";

interface OwnProps {
  output_type: string;
  id: string;
  contentRef: ContentRef;
  output: ImmutableDisplayData | ImmutableExecuteResult;
  index: number;
}

interface Props extends OwnProps {
  mediaActions: {
    onMetadataChange: (metadata: JSONObject) => void;
  };
  Media: React.ComponentType<any>;
  mediaType?: string;
}

const PureTransformMedia = (props: Props) => {
  const { Media, mediaActions, mediaType, output } = props;

  // If we had no valid result, return an empty output
  if (!mediaType) {
    return null;
  }

  return (
    <Media
      {...mediaActions}
      data={output.data[mediaType]}
      metadata={output.metadata.get(mediaType)}
    />
  );
};

const richestMediaType = (
  output: ImmutableExecuteResult | ImmutableDisplayData,
  order: Immutable.List<string>,
  handlers: { [k: string]: any }
) => {
  const outputData = output.data;

  // Find the first mediaType that we both support with handlers and is in the output data
  const mediaType = order.find(key => {
    return outputData.hasOwnProperty(key) && handlers.hasOwnProperty(key);
  });

  return mediaType;
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
    if (mediaType) {
      const Media = selectors.transform(state, { id: mediaType });
      return {
        Media,
        mediaType,
        output
      };
    }
    return {
      Media: () => null,
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
        onMetadataChange: (metadata: JSONObject) => {
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
