import React from "react";
import { connect } from "react-redux";

import { AppState } from "@nteract/core";
import { Dispatch } from "redux";

const NTERACT_LOGO_URL =
  "https://media.githubusercontent.com/media/nteract/logos/master/nteract_logo_cube_book/exports/images/svg/nteract_logo_wide_purple_inverted.svg";

interface StateProps {
  showPanel: boolean;
}

interface DispatchProps {
  toggleShowPanel: () => void;
  launchServer: () => void;
}

export class BinderHeader extends React.PureComponent<
  StateProps & DispatchProps
> {
  render(): JSX.Element {
    const { launchServer, toggleShowPanel, showPanel } = this.props;
    return (
      <header>
        <div className="left">
          <img
            src={NTERACT_LOGO_URL}
            alt="nteract logo"
            className="nteract-logo"
          />

          <button
            onClick={launchServer}
            className="play"
            disabled={false}
            title={"Launch Server"}
          >
            ▶ Launch Server
          </button>
          <button onClick={() => toggleShowPanel()}>
            {showPanel ? "Hide" : "Show"} logs
          </button>
        </div>
      </header>
    );
  }
}

const makeMapStateToProps = (initialState: AppState, ownProps: {}) => {
  const mapStateToProps = (state: AppState) => {
    return {
      showPanel: false
    };
  };
  return mapStateToProps;
};

const makeMapDispatchToProps = (initialDispatch: Dispatch) => {
  const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
      toggleShowPanel: () => dispatch({}),
      launchServer: () => dispatch({})
    };
  };
  return mapDispatchToProps;
};

export default connect<StateProps, DispatchProps, {}, AppState>(
  makeMapStateToProps
)(BinderHeader);
