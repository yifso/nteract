import React from "react";

import Notebook from "@nteract/notebook-app-component";
import BinderConsole from "../components/binder-console";
import BinderHeader from "../components/binder-header";

const IndexPage: NextPage = () => {
  return (
    <React.Fragment>
      <BinderHeader />
      <BinderConsole />
      <Notebook contentRef={"tests"} />;
    </React.Fragment>
  );
};

export default IndexPage;
