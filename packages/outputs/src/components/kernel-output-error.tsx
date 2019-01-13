import Ansi from "ansi-to-react";
import * as React from "react";
import styled from "styled-components";

interface Props {
  /**
   *  The name of the exception. This value is returned by the kernel.
   */
  ename: string;
  /**
   * The value of the exception. This value is returned by the kernel.
   */
  evalue: string;
  /**
   * The output type passed to the Output component. This should be `error`
   * if you would like to render a KernelOutputError component.
   */
  outputType: string;
  /**
   * The tracebook of the exception. This value is returned by the kernel.
   */
  traceback: string[];
}

const PlainKernelOutputError = (props: Props) => {
  const { ename, evalue, traceback } = props;

  const joinedTraceback = Array.isArray(traceback)
    ? traceback.join("\n")
    : traceback;

  let kernelOutputError = [];

  if (joinedTraceback) {
    kernelOutputError.push(joinedTraceback);
  } else {
    if (ename && evalue) {
      kernelOutputError.push(`${ename}: ${evalue}`);
    }
  }

  return <Ansi linkify={false}>{kernelOutputError.join("\n")}</Ansi>;
};

PlainKernelOutputError.defaultProps = {
  outputType: "error",
  ename: "",
  evalue: "",
  traceback: []
};

export const KernelOutputError = styled(PlainKernelOutputError)`
  & code {
    white-space: pre-wrap;
  }
`;

KernelOutputError.displayName = "KernelOutputError";
