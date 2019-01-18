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
  cellId: string;
  contentRef: ContentRef;
  index: number;
}

interface MappedProps {
  Media: React.ComponentType<any>;
  mediaType?: string;
  output?: ImmutableDisplayData | ImmutableExecuteResult;
}

interface DispatchProps {
  mediaActions: {
    onMetadataChange: (metadata: JSONObject) => void;
  };
}

const PureTransformMedia = (props: MappedProps & DispatchProps) => {
  const { Media, mediaActions, mediaType, output } = props;

  // If we had no valid result, return an empty output
  if (!mediaType || !output) {
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
  handlers: { [k: string]: any } | Immutable.Map<string, any>
) => {
  const outputData = output.data;

  // Find the first mediaType in the output data that we support with a handler
  const mediaType = order.find(key => {
    return (
      outputData.hasOwnProperty(key) &&
      (handlers.hasOwnProperty(key) || handlers.get(key, false))
    );
  });

  return mediaType;
};

const makeMapStateToProps = (
  initialState: AppState,
  initialProps: OwnProps
) => {
  const { contentRef, index, cellId } = initialProps;

  const mapStateToProps = (state: AppState): MappedProps => {
    const output: ImmutableOutput = state.core.entities.contents.byRef.getIn(
      [contentRef, "model", "notebook", "cellMap", cellId, "outputs", index],
      null
    );

    // This component should only be used with display data and execute result
    if (
      !output ||
      !(
        output.output_type === "display_data" ||
        output.output_type === "execute_result"
      )
    ) {
      console.warn(
        "connected transform media managed to get a non media bundle output"
      );
      return {
        Media: () => null
      };
    }

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
  const { cellId, contentRef, index } = initialProps;
  const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
      mediaActions: {
        onMetadataChange: (metadata: JSONObject) => {
          dispatch(
            actions.updateOutputMetadata({
              id: cellId,
              contentRef,
              metadata,
              index
            })
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
