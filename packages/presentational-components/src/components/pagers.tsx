import * as React from "react";

import { Outputs } from "./outputs";
import styled from "styled-components";
/**
 * Description
 */

interface PagersProps {
  children: React.ReactNode;
  hidden: boolean;
}

export const Pagers = styled(Outputs)`
  background-color: var(--theme-pager-bg, #fafafa);
`;
