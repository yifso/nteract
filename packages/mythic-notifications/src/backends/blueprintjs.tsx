import { Callout, Classes, Intent, Spinner, Toaster } from "@blueprintjs/core";
import { MythicComponent } from "@nteract/myths";
import React, { RefObject } from "react";
import { Dispatch } from "redux";
import styled from "styled-components";
import { initializeSystem } from "../myths/initialize-system";
import { NotificationAction, NotificationMessage, NotificationSystem } from "../types";

const FloatRight = styled.div`
  float: right;
`;

const calloutStyle = {
  margin: "-11px 0 -11px -11px",
  background: "transparent",
};

const callbackOf = (action: NotificationAction, dispatch: Dispatch) => {
  if ("callback" in action) {
    return action.callback;
  }

  if ("dispatch" in action) {
    return () => dispatch(action.dispatch);
  }
}

export const blueprintjsNotificationSystem =
  (toaster: Toaster, dispatch: Dispatch): NotificationSystem => ({
    addNotification: (msg: NotificationMessage) => {
      const intent = {
        "in-progress": Intent.PRIMARY,
        info: Intent.PRIMARY,
        success: Intent.SUCCESS,
        warning: Intent.WARNING,
        error: Intent.DANGER,
      }[msg.level ?? "info"];

      toaster.show({
        message: (
          <>
            {msg.level === "in-progress"
              ? <FloatRight>
                  <Spinner size={20} intent={intent}/>
                </FloatRight>
              : null}
            <Callout
              icon={msg.icon}
              title={msg.title}
              intent={intent}
              style={calloutStyle}
            >
              {msg.message}
            </Callout>
          </>
        ),
        action: msg.action
          ? {
              icon: msg.action.icon ?? "arrow-right",
              text: msg.action.label,
              onClick: callbackOf(msg.action, dispatch),
            }
          : undefined,
        timeout: msg.action || msg.level === "in-progress"
          ? 0
          : 10_000,
      }, msg.key);
    },
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
    class extends MythicComponent<
      typeof initializeSystem,
      { darkTheme?: boolean }
      > {
      toaster?: RefObject<Toaster>;

      postConstructor(): void {
        this.toaster = React.createRef();
      }

      componentDidMount(): void {
        this.props.initializeSystem(
          blueprintjsNotificationSystem(this.toaster!.current!, this.props.dispatch)
        );
      }

      render(): JSX.Element {
        return (
          <DoNotPrint>
            <Toaster
              ref={this.toaster}
              position={"top-right"}
              className={this.props.darkTheme ? Classes.DARK : undefined}
              usePortal={false}   // needed for the theme class to bubble down
            />
          </DoNotPrint>
        );
      }
    },
  );
