import { Classes, Toaster } from "@blueprintjs/core";
import { MythicComponent } from "@nteract/myths";
import { AppState } from "@nteract/types";
import React, { RefObject } from "react";
import styled from "styled-components";
import { blueprintjsNotificationSystem } from "../backends/blueprintjs";
import { notifications } from "../package";
import { NotificationSystem } from "../types";

const initializeSystem =
  notifications.createMyth("initializeSystem")<NotificationSystem>({
    reduce: (state, action) =>
      state.set("current", action.payload),
  });

const DoNotPrint =
  styled.div`
    @media print {
      display: none;
    }
  `;

export const NotificationRoot =
  initializeSystem.createConnectedComponent(
    "NotificationRoot",
    class extends MythicComponent<typeof initializeSystem, { theme: string }> {
      toaster?: RefObject<Toaster>;

      postConstructor(): void {
        this.toaster = React.createRef();
      }

      componentDidMount(): void {
        this.props.initializeSystem(
          blueprintjsNotificationSystem(this.toaster!.current!)
        );
      }

      render(): JSX.Element {
        return (
          <DoNotPrint>
            <Toaster
              ref={this.toaster}
              position={"top-right"}
              className={this.props.theme === "dark" ? Classes.DARK : undefined}
              usePortal={false}   // needed for the theme class to bubble down
            />
          </DoNotPrint>
        );
      }
    },
    (state: AppState) => ({
      theme: state.config.get("theme"),
    }),
  );
