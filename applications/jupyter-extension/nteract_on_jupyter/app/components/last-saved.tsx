/**
 * A simple contentRef aware component that renders a little lastSaved
 * display.
 *
 * import LastSaved from "./last-saved"
 * <LastSaved contentRef={someRef} />
 *
 * If the contentRef is available and has a lastSaved, will render something like:
 *
 * Last Saved: 2 minutes ago
 *
 */

import { AppState, ContentRef, selectors } from "@nteract/core";
import moment from "moment";
import * as React from "react";
import { connect } from "react-redux";
import styled from "styled-components";

interface LastSavedProps {
  date: string | number | Date | null;
}

const Span = styled.span`
  margin: 0 auto;
  font-size: 15px;
  color: var(--nt-nav-dark);
`;

const Pretext = styled(Span)`
  font-weight: var(--nt-font-weight-bolder);
  padding-right: 10px;
`;

class LastSaved extends React.PureComponent<LastSavedProps> {
  intervalId!: number;
  isStillMounted: boolean;

  constructor(props: LastSavedProps) {
    super(props);
    this.isStillMounted = false;
  }

  componentDidMount() {
    this.isStillMounted = true;
    this.intervalId = window.setInterval(() => {
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
    if (this.props.date === null) {
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
        <Pretext title={title}>Last Saved: </Pretext>
        <Span title={title}>{text}</Span>
      </React.Fragment>
    );
  }
}

interface OwnProps {
  contentRef: string;
}

/**
 * Create our state mapper using makeMapStateToProps
 * Following https://twitter.com/dan_abramov/status/719971882280361985?lang=en
 */
const makeMapStateToProps = (
  initialState: AppState,
  initialProps: OwnProps
) => {
  const { contentRef } = initialProps;

  const mapStateToProps = (state: AppState): LastSavedProps => {
    const content = selectors.contentByRef(state).get(contentRef);
    if (!content || !content.lastSaved) {
      return { date: null };
    }
    return { date: content.lastSaved };
  };

  return mapStateToProps;
};

export default connect<LastSavedProps, typeof LastSaved, OwnProps, AppState>(
  makeMapStateToProps
)(LastSaved);
