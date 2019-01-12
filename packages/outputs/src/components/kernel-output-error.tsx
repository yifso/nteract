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
  output_type: "error";
  /**
   * The tracebook of the exception. This value is returned by the kernel.
   */
  traceback: string[];
}

const PlainKernelOutputError = (props: Partial<Props>) => {
  const { ename, evalue, traceback } = props;

  const joinedTraceback = Array.isArray(traceback)
    ? traceback.join("\n")
    : traceback;

  const kernelOutputError = [];

  if (joinedTraceback) {
    kernelOutputError.push(joinedTraceback);
  } else {
    if (ename && evalue) {
      kernelOutputError.push(`${ename}: ${evalue}`);
    }
  }

  return <Ansi linkify={false}>{kernelOutputError.join("\n")}</Ansi>;
};

export const KernelOutputError = styled(PlainKernelOutputError)`
  & code {
    white-space: pre-wrap;
  }
`;

KernelOutputError.defaultProps = {
  output_type: "error",
  ename: "",
  evalue: "",
  traceback: []
};

KernelOutputError.displayName = "KernelOutputError";
