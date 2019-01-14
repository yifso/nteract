import * as React from "react";
import styled from "styled-components";
import { MediaBundle } from "@nteract/records";
import {
  richestMimetype,
  displayOrder,
  transforms
} from "@nteract/transforms-full";

/** Error handling types */
interface ReactErrorInfo {
  componentStack: string;
}

interface Caught {
  error: Error;
  info: ReactErrorInfo;
}

interface RichMediaProps {
  /**
   * Object of media type → data
   *
   * E.g.
   *
   * ```js
   * {
   *   "text/plain": "raw text",
   * }
   * ```
   *
   * See [Jupyter message spec](http://jupyter-client.readthedocs.io/en/stable/messaging.html#display-data)
   * for more detail.
   *
   */
  data: MediaBundle;
  /**
   * custom settings, typically keyed by media type
   */
  metadata: { [mediaType: string]: object };
  /**
   * React elements that accept mimebundle data, will get passed data[mimetype]
   */
  children: React.ReactNode;

  renderError(param: {
    error: Error;
    info: ReactErrorInfo;
    data: MediaBundle;
    metadata: object;
    children: React.ReactNode;
  }): React.ReactElement<any>;
}

/* We make the RichMedia component an error boundary in case of any <Media /> component erroring */
interface State {
  caughtError?: Caught | null;
}

const ErrorFallbackDiv = styled.div`
  backgroundcolor: ghostwhite;
  color: black;
  font-weight: 600;
  display: block;
  padding: 10px;
  margin-bottom: 20px;
`;

const ErrorFallback = (caught: Caught) => (
  <ErrorFallbackDiv>
    <h3>{caught.error.toString()}</h3>
    <details>
      <summary>stack trace</summary>
      <pre>{caught.info.componentStack}</pre>
    </details>
  </ErrorFallbackDiv>
);

export class RichMedia extends React.Component<RichMediaProps, State> {
  static defaultProps: Partial<RichMediaProps> = {
    data: {},
    metadata: {},
    renderError: ErrorFallback
  };

  state: Partial<State> = {};

  componentDidCatch(error: Error, info: ReactErrorInfo) {
    this.setState({ caughtError: { error, info } });
  }

  render() {
    if (this.state.caughtError) {
      return this.props.renderError({
        ...this.state.caughtError,
        data: this.props.data,
        metadata: this.props.metadata,
        children: this.props.children
      });
    }

    // We must pick only one child to render
    let chosenOne: React.ReactChild | null = null;

    const data = this.props.data;
    const mimetype = richestMimetype(data, displayOrder, transforms);

    // Find the first child element that matches something in this.props.data
    React.Children.forEach(this.props.children, child => {
      const childElement = child as React.ReactElement<any>;
      if (chosenOne) {
        // Already have a selection
        return;
      }
      if (
        childElement.props &&
        childElement.props.mediaType &&
        childElement.props.mediaType === mimetype
      ) {
        chosenOne = childElement;
        return;
      }
    });

    // If we didn't find a match, render nothing
    if (chosenOne === null) {
      return null;
    }

    const mediaType = (chosenOne as React.ReactElement<any>).props.mediaType;

    return React.cloneElement(chosenOne, {
      data: this.props.data[mediaType],
      metadata: this.props.metadata[mediaType]
    });
  }
}
