import * as React from "react";
import { doEmbedding } from "./external";
import { VegaMediaType } from "./mime";

/** Props needed for embedding a certain Vega (Lite) media type. */
export interface VegaEmbedProps<T extends VegaMediaType> {
  spec: Readonly<{}>;
  mediaType: T;
}

/** React component embedding a certain Vega (Lite) media type. */
export class VegaEmbed<T extends VegaMediaType>
  extends React.Component<VegaEmbedProps<T>> {

  private anchorRef: React.RefObject<HTMLDivElement>;

  constructor(props: VegaEmbedProps<T>) {
    super(props);
    this.anchorRef = React.createRef<HTMLDivElement>();
  }

  render(): JSX.Element {
    return <div ref={this.anchorRef} />;
  }

  async callEmbedder(): Promise<void> {
    if (this.anchorRef.current === null) { return; }

    try {
      await doEmbedding(
        this.anchorRef.current,
        this.props.mediaType,
        this.props.spec,
      );
    }
    catch(error) {
      console.log(error);
    }
  }

  shouldComponentUpdate(nextProps: VegaEmbedProps<T>): boolean {
    return this.props.spec !== nextProps.spec;
  }

  componentDidMount(): void {
    this.callEmbedder().then();
  }

  componentDidUpdate(): void {
    this.callEmbedder().then();
  }

}
