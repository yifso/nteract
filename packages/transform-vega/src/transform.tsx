import * as React from "react";
import { VegaEmbeddingOptions, VegaEmbedProps, VegaTransform, VegaVersion } from "./types";

export function makeTransform<T extends string>(
  version: VegaVersion<T>,
  options: VegaEmbeddingOptions,
): VegaTransform<T> {
  const vegaTransform: VegaTransform<T> = (props) =>
    <VegaEmbed
      spec={props.data}
      version={version}
      options={options}
    />;

  vegaTransform.MIMETYPE = version.mediaType;

  return vegaTransform;
}

export class VegaEmbed<T extends string>
  extends React.Component<VegaEmbedProps<T>> {
  private anchorRef: React.RefObject<HTMLDivElement>;

  constructor(props: VegaEmbedProps<T>) {
    super(props);
    this.anchorRef = React.createRef<HTMLDivElement>();
  }

  async callEmbedder(): Promise<void> {
    if (this.anchorRef.current === null) { return; }

    // Need a mutable deep copy of the spec since vega may add metadata anywhere
    const mutableSpec = JSON.parse(JSON.stringify(this.props.spec));

    console.log(mutableSpec);

    try {
      await this.props.options.embedder(this.anchorRef.current, mutableSpec);
    }
    catch(error) {
      console.log(error);
    }
  }

  componentDidMount(): void {
    this.callEmbedder().then();
  }

  componentDidUpdate(): void {
    this.callEmbedder().then();
  }

  shouldComponentUpdate(nextProps: VegaEmbedProps<T>): boolean {
    return this.props.spec !== nextProps.spec;
  }

  render(): JSX.Element {
    return (
      <React.Fragment>
        {this.props.options.prelude}
        <div ref={this.anchorRef} />
      </React.Fragment>
    );
  }
}
