/**
 * A simple contentRef aware component that renders a little lastSaved
 * display.
 *
 * import LastSaved from "./last-saved.js"
 * <LastSaved contentRef={someRef} />
 *
 * If the contentRef is available and has a lastSaved, will render something like:
 *
 * Last Saved: 2 minutes ago
 *
 */

import * as React from "react";
import { selectors } from "@nteract/core";
import { ContentRef, AppState } from "@nteract/core";
import moment from "moment";
import styled from "styled-components";
import { connect } from "react-redux";

type LastSavedProps = {
  date: string | number | Date | null
};

const Span = styled.span`
  margin: 0 auto;
  font-size: 15px;
  color: var(--nt-nav-dark);
`;

const Pretext = styled(Span)`
  font-weight: var(--nt-font-weight-bolder);
  padding-right: 10px;
`;

class LastSaved extends React.Component<LastSavedProps, null> {
  intervalId: NodeJS.Timeout;
  isStillMounted: boolean;

  constructor(props: LastSavedProps) {
    super(props);
    this.isStillMounted = false;
  }

  componentDidMount() {
    this.isStillMounted = true;
    this.intervalId = setInterval(() => {
      if (this.isStillMounted && this.props.date !== null) {
        // React Component method. Forces component to update.
        // See https://reactjs.org/docs/react-component.html#forceupdate
        this.forceUpdate();
      }
    }, 30 * 1000);
  }

  componentWillUnmount() {
    this.isStillMounted = false;
    clearInterval(this.intervalId);
  }

  render() {
    if (this.props.date == null) {
      return null;
    }

    const precious = moment(this.props.date);

    let text = "just now";

    if (moment().diff(precious) > 25000) {
      text = precious.fromNow();
    }

    const title = precious.format("MMMM Do YYYY, h:mm:ss a");

    return (
      <React.Fragment>
        <Pretext title={title}>
          Last Saved:{" "}
        </Pretext>
        <Span className="timetext" title={title}>
          {text}
        </Span>
      </React.Fragment>
    );
  }
}

const ConnectedLastSaved = connect(
  (
    state: AppState,
    ownProps: { contentRef: ContentRef }
  ): { date: string | number | Date | null } => {
    const content = selectors.content(state, ownProps);
    if (!content || !content.lastSaved) {
      return { date: null };
    }
    return { date: content.lastSaved };
  }
)(LastSaved);

export default ConnectedLastSaved;
