import { WithRouterProps } from "next/dist/client/with-router";
import dynamic from "next/dynamic";
import { withRouter } from "next/router";
import React from "react";

import { Host } from "@mybinder/host-cache";

const Notebook = dynamic(() => import("../../components/notebook"), {
  ssr: false
});

const BINDER_URL = "https://mybinder.org";

export class Main extends React.PureComponent<WithRouterProps> {
  render(): JSX.Element {
    const { params } = this.props.router.query;

    /**
     * Since we use a single file named [...params] to aggregate
     * all of the configurable options passeed into the url, we have
     * to parse the parameters positional based on their position in the
     * URL.
     *
     * The expected URL structire is /{provider}/{org}/{repo}/{ref}/{filepath}.
     */
    if (params) {
      const _provider = params[0];
      const org = params[1];
      const repo = params[2];
      const gitRef = params[3];

      const filepathSegments = params.slice(4);
      let filepath;
      if (typeof filepathSegments !== "string") {
        filepath = filepathSegments.join("");
      } else {
        filepath = filepathSegments;
      }

      return (
        <Host repo={`${org}/${repo}`} gitRef={gitRef} binderURL={BINDER_URL}>
          <Host.Consumer>
            {host => <Notebook filepath={filepath} host={host} />}
          </Host.Consumer>
        </Host>
      );
    }
    return null;
  }
}

export default withRouter(Main);
