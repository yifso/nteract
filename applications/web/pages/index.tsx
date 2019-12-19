import React from "react";

import App from "../components/app";
import BinderConsole from "../components/binder-console";
import BinderHeader from "../components/binder-header";

const IndexPage: NextPage = () => {
  return (
    <React.Fragment>
      <BinderHeader />
      <BinderConsole />
      <App />
    </React.Fragment>
  );
};

export default IndexPage;
