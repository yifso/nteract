export const TOGGLE_SHOW_PANEL = "TOGGLE_SHOW_PANEL";
export const toggleShowPanel = (showPanel: boolean) => ({
  type: TOGGLE_SHOW_PANEL,
  payload: {
    showPanel
  }
});

export const LAUNCH_SERVER = "LAUNCH_SERVER";
export const launchServer = (repo: string, gitRef: string) => ({
  type: LAUNCH_SERVER,
  payload: {
    repo,
    gitRef
  }
});

export const CHANGE_GIT_REF = "CHANGE_GIT_REF";
export const changeGitRef = (gitRef: string) => ({
  type: CHANGE_GIT_REF,
  payload: {
    gitRef
  }
});

export const CHANGE_REPO = "CHANGE_REPO";
export const changeRepo = (repo: string) => ({
  type: CHANGE_REPO,
  payload: {
    repo
  }
});

export const ADD_SERVER_MSG = "ADD_SERVER_MSG";
export const addServerMsg = (message: any) => ({
  type: ADD_SERVER_MSG,
  payload: {
    message
  }
});

export const SET_FILE = "SET_FILE";
export const setFile = (contentRef: string) => ({
  type: SET_FILE,
  payload: {
    contentRef
  }
});
