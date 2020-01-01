import React from "react";

import App from "../components/app";

import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/select/lib/css/blueprint-select.css";

import "codemirror/addon/hint/show-hint.css";
import "codemirror/lib/codemirror.css";

import "@nteract/styles/app.css";
import "@nteract/styles/editor-overrides.css";
import "@nteract/styles/global-variables.css";

const IndexPage: NextPage = () => {
  return (
    <React.Fragment>
      <App />
    </React.Fragment>
  );
};

export default IndexPage;
