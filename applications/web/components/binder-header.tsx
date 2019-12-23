import React from "react";
import { connect } from "react-redux";

import { AppState } from "@nteract/core";
import { Dispatch } from "redux";
import styled from "styled-components";

import * as actions from "../redux/actions";

const NTERACT_LOGO_URL =
  "https://media.githubusercontent.com/media/nteract/logos/master/nteract_logo_cube_book/exports/images/svg/nteract_logo_wide_purple_inverted.svg";

interface StateProps {
  showPanel: boolean;
}

interface DispatchProps {
  toggleShowPanel: () => void;
  launchServer: () => void;
}

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  background-color: black;

  & img {
    height: calc(var(--header-height) - 16px);
    width: 80px;
    margin-left: 10px;
    padding: 0px 20px 0px 10px;
  }

  & img,
  button,
  div {
    vertical-align: middle;
  }

  & button {
    padding: 0px 16px;
    border: none;
    outline: none;
    border-radius: unset;
    background-color: rgba(0, 0, 0, 0);
    color: white;
    height: 42px;
    font-family: Monaco, monospace;
  }

  & button:active,
  button:focus {
    background-color: rgba(255, 255, 255, 0.1);
  }

  & button:hover {
    background-color: rgba(255, 255, 255, 0.2);
    color: #d7d7d7;
  }

  & button:disabled {
    background-color: rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.1);
  }
`;

export class BinderHeader extends React.PureComponent<
  StateProps & DispatchProps
> {
  render(): JSX.Element {
    const { launchServer, toggleShowPanel, showPanel } = this.props;
    return (
      <Header>
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
          <button onClick={() => toggleShowPanel(!showPanel)}>
            {showPanel ? "Hide" : "Show"} logs
          </button>
        </div>
      </Header>
    );
  }
}

const mapStateToProps = (state: AppState) => {
  return {
    showPanel: state.webApp.showPanel
  };
};

const makeMapDispatchToProps = (initialDispatch: Dispatch) => {
  const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
      toggleShowPanel: (showPanel: boolean) =>
        dispatch(actions.toggleShowPanel(showPanel)),
      launchServer: (repo: string, gitRef: string) =>
        dispatch(actions.launchServer(repo, gitRef))
    };
  };
  return mapDispatchToProps;
};

export default connect<StateProps, DispatchProps, {}, AppState>(
  mapStateToProps,
  makeMapDispatchToProps
)(BinderHeader);
