import * as React from "react";

interface Props {
  prompt: string;
  password: boolean;
  submitPromptReply: any;
}

export const PromptRequest = (props: Props) => {
  if (props.password) {
    return (
      <form onsubmit={props.submitPromptReply}>
        <input type="password" />
        <input type="submit" />
      </form>
    );
  }
  return (
    <form onsubmit={props.submitPromptReply}>
      <input type="text" />
      <input type="submit" />
    </form>
  );
};

export default PromptRequest;
