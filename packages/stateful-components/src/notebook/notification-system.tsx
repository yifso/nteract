/**
 * Main entry point for the desktop notebook UI
 */

import { Intent, Toaster } from "@blueprintjs/core";
import { actions } from "@nteract/core";
import { Notification, NotificationSystem } from "@nteract/types";
import React, { RefObject } from "react";
import { connect } from "react-redux";

interface CreateNotificationSystemProps {
  setNotificationSystem: (payload: NotificationSystem) => void;
}

class PureCreateNotificationSystem
  extends React.PureComponent<CreateNotificationSystemProps> {

  toaster: RefObject<Toaster>;

  constructor(props: CreateNotificationSystemProps) {
    super(props);
    this.toaster = React.createRef();
  }

  componentDidMount(): void {
    const component = this;
    this.props.setNotificationSystem({
      addNotification: (msg: Notification) => {
        component.toaster.current!.show({
          message: `${msg.title ?? ""} ${msg.message ?? ""}`,
          intent: ({
            warning: Intent.WARNING,
            error: Intent.DANGER,
          } as any)[msg.level ?? "info"] ?? Intent.PRIMARY,
        });
        return msg;
      }
    });
  }

  render(): JSX.Element {
    return (
      <Toaster ref={this.toaster} />
    );
  }
}

export const CreateNotificationSystem = connect(null, (dispatch, _props) => ({
  setNotificationSystem: (payload: NotificationSystem) =>
    dispatch(actions.setNotificationSystem(payload)),
}))(PureCreateNotificationSystem);
