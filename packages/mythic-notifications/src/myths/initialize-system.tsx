import { Toaster } from "@blueprintjs/core";
import React, { RefObject } from "react";
import { connect } from "react-redux";

import { blueprintjsNotificationSystem } from "../backends/blueprintjs";
import { createMyth } from "../external/myths";
import { NotificationsProps } from "../types";


export const initializeSystem = createMyth(
  "notifications",
  "NOTIFICATIONS/INITIALIZE_SYSTEM",
)<NotificationsProps>({
  reduce: (state, action) =>
    state.set("current", action.payload.current)
});

interface BlueprintNotificationsProps {
  initializeSystem: (payload: NotificationsProps) => void;
}

class UnconnectedBlueprintNotifications
  extends React.PureComponent<BlueprintNotificationsProps> {

  toaster: RefObject<Toaster>;

  constructor(props: BlueprintNotificationsProps) {
    super(props);
    this.toaster = React.createRef();
  }

  componentDidMount(): void {
    this.props.initializeSystem({
      current: blueprintjsNotificationSystem(this.toaster.current!),
    });
  }

  render(): JSX.Element {
    return (
      <Toaster ref={this.toaster}/>
    );
  }
}

export const NotificationRoot = connect(
  null,
  { initializeSystem: initializeSystem.create },
)(UnconnectedBlueprintNotifications);

NotificationRoot.displayName = "BlueprintNotifications";
