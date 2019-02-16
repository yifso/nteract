// Vendor modules
import * as React from "react";

// Local modules
import * as styles from "../styled";
import { Metadata } from "../types";

// Styled Components
const MetadataWarningWrapper = styles.MetadataWarningWrapper;
const MetadataWarningContent = styles.MetadataWarningContent;

export const MetadataWarning = ({ metadata }: { metadata: Metadata }) => {
  const warning =
    metadata && metadata.sampled ? (
      <span>
        <b>NOTE:</b> This data is sampled
      </span>
    ) : null;

  return (
    <MetadataWarningWrapper>
      {warning ? (
        <MetadataWarningContent>{warning}</MetadataWarningContent>
      ) : null}
    </MetadataWarningWrapper>
  );
};
