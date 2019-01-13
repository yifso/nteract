import { StreamOutput } from "@nteract/records";
import Ansi from "ansi-to-react";
import * as React from "react";

type Props = StreamOutput;

export const StreamText = (props: Props) => {
  const { text, name } = props;

  return (
    <Ansi linkify={false} className={`"nteract-display-area-${name}`}>
      {text}
    </Ansi>
  );
};

StreamText.defaultProps = {
  outputType: "stream",
  text: "",
  name: "stdout"
};
