import React from "react";
import { connect } from "react-redux";
import { Myth } from "./types";

export class MythicComponent<MYTH extends Myth, PROPS = {}>
  extends React.PureComponent<{
    [key in MYTH["name"]]: (payload: MYTH["props"]) => void;
  } & PROPS> {
  constructor(props: MYTH["props"] & PROPS) {
    super(props);
    this.postConstructor();
  }

  postConstructor(): void {
    // Override in subclasses
  };
}

export const makeCreateConnectedComponent =
  <MYTH extends Myth>(myth: MYTH) => {
    return (
      <COMPONENT_NAME extends string>(
        componentName: COMPONENT_NAME,
        cls: any,
        makeState: ((state: any) => any) | null = null,
      ) => {
        const component = connect(
          makeState,
          { [myth.name]: myth.create },
        )(cls);
        component.displayName = componentName;
        return component;
      }
    );
  }
