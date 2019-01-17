import Immutable from "immutable";
import React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";

import {
  ImmutableDisplayData,
  ImmutableExecuteResult,
  ImmutableOutput,
  JSONObject
} from "@nteract/commutable";
import { actions, selectors } from "@nteract/core";
import { AppState, ContentRef } from "@nteract/types";

interface OwnProps {
  output_type: string;
  id: string;
  contentRef: ContentRef;
  output: ImmutableOutput;
  index: number;
}

interface Props extends OwnProps {
  mediaActions: {
    onMetadataChange: (metadata: JSONObject) => void;
  };
  Media: React.ComponentType<any>;
  mediaType?: string;
}

class PureTransformMedia extends React.Component<Props> {
  render() {
    const { Media, mediaActions, mediaType } = this.props;
    return (
      <Media
        {...mediaActions}
        data={this.props.output.get("data").get(mediaType)}
        metadata={this.props.output.get("metadata").get(mediaType)}
      />
    );
  }
}

const richestMediaType = (
  output: ImmutableExecuteResult | ImmutableDisplayData,
  order: Immutable.List<string>,
  handlers: any
) => {
  const outputData = output.data;

  const validMediaTypes = Immutable.List<string>(
    outputData.keys((mediaType: string) => {
      if (handlers[mediaType] && order.includes(mediaType)) {
        return mediaType;
      }
    })
  );
  return validMediaTypes
    .sort((a: string, b: string) => order.indexOf(a) - order.indexOf(b))
    .get(0);
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
      mediaType,
      Media: () => null,
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
