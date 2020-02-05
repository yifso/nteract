import { Toaster } from "@blueprintjs/core";
import React, { RefObject } from "react";

import { blueprintjsNotificationSystem } from "../backends/blueprintjs";
import { createMyth, createMythicConnectedComponent, MythicComponent } from "../external/myths";
import { NotificationsProps } from "../types";


export const initializeSystem = createMyth(
  "notifications",
  "initializeSystem",
  "NOTIFICATIONS/INITIALIZE_SYSTEM",
)<NotificationsProps>({
  reduce: (state, action) =>
    state.set("current", action.payload.current),
});

export const NotificationRoot = createMythicConnectedComponent(
  "NotificationRoot",
  initializeSystem,
  class extends MythicComponent<typeof initializeSystem> {
    toaster?: RefObject<Toaster>;

    postConstructor(): void {
      this.toaster = React.createRef();
    }

    componentDidMount(): void {
      this.props.initializeSystem({
        current: blueprintjsNotificationSystem(this.toaster!.current!),
      });
    }

    render(): JSX.Element {
      return <Toaster ref={this.toaster}/>;
    }
  },
);
