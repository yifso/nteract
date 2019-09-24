import * as React from "react";
import Backbone from "backbone";

interface Props {
  model: Backbone.Model;
}

export default class BackboneWrapper extends React.Component<Props> {
  render() {
    return <pre>BackboneWrapper implementation is in progress.</pre>;
  }
}
