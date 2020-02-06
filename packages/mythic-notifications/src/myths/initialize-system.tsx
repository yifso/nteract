import { Classes, Toaster } from "@blueprintjs/core";
import { selectors } from "@nteract/core";
import React, { RefObject } from "react";
import styled from "styled-components";
import { blueprintjsNotificationSystem } from "../backends/blueprintjs";
import { MythicComponent } from "../external/myths";
import { notifications } from "../package";

const initializeSystem =
  notifications.createMyth("initializeSystem")({
    reduce: (state, action) =>
      state.set("current", action.payload.current),
  });

const DoNotPrint = styled.div`
  @media print {
    display: none;
  }
`;

export const NotificationRoot = initializeSystem.createConnectedComponent(
  "NotificationRoot",
  class extends MythicComponent<typeof initializeSystem, { theme: string }> {
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
      return (
        <DoNotPrint>
          <Toaster
            ref={this.toaster}
            usePortal={false}
            position={"top-right"}
            className={this.props.theme === "dark" ? Classes.DARK : undefined}
          />
        </DoNotPrint>
      );
    }
  },
  (state) => ({theme: selectors.currentTheme(state)}),
);
