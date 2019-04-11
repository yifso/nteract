import styled from "styled-components";

import reactTableStyles from "./react-table";
import reactTableFixedColumnStyles from "./react-table-hoc-fixed-columns";

// concatenate style dependencies into a styled-component wrapper for grid view
export default styled.div`
  ${reactTableStyles}
  ${reactTableFixedColumnStyles}
`;
