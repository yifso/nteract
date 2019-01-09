import styled from "styled-components";

const TextArea = styled.textarea.attrs({
  autoComplete: "off"
})`
  font-family: "Dank Mono", dm, "Source Code Pro", "Monaco", monospace;
  font-size: 14px;
  line-height: 20px;

  height: inherit;

  background: none;

  border: none;
  overflow: hidden;

  -webkit-scrollbar: none;
  -webkit-box-shadow: none;
  -moz-box-shadow: none;
  box-shadow: none;
  width: 100%;
  resize: none;
  padding: 10px 0 5px 10px;
  letter-spacing: 0.3px;
  word-spacing: 0px;

  &:focus {
    outline: none;
    border: none;
  }
`;

export default TextArea;
