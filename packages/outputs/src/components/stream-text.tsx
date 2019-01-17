import { StreamOutputParams } from "@nteract/commutable";
import Ansi from "ansi-to-react";
import * as React from "react";

type Props = StreamOutputParams;

export const StreamText = (props: Props) => {
  const { text, name } = props;
  debugger;

  return (
    <Ansi linkify={false} className={`"nteract-display-area-${name}`}>
      {text}
    </Ansi>
  );
};

StreamText.defaultProps = {
  output_type: "stream",
  text: "",
  name: "stdout"
};
