import * as React from "react";

interface Props {
  prompt: string;
  password: boolean;
  submitPromptReply: any;
}

interface State {
  value: string;
}

export class PromptRequest extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { value: "" };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmitPromptReply = this.handleSubmitPromptReply.bind(this);
  }

  handleSubmitPromptReply(event) {
    event.preventDefault();
    this.props.submitPromptReply(this.state.value);
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  render() {
    if (this.props.password) {
      return (
        <form onSubmit={this.handleSubmitPromptReply}>
          <input
            type="password"
            value={this.state.value}
            onChange={this.handleChange}
          />
          <input type="submit" />
        </form>
      );
    }
    return (
      <form onSubmit={this.handleSubmitPromptReply}>
        <input
          type="text"
          value={this.state.value}
          onChange={this.handleChange}
        />
        <input type="submit" />
      </form>
    );
  }
}

export default PromptRequest;
