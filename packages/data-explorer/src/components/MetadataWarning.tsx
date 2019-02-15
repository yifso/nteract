const MetadataWarning = ({ metadata }: { metadata: Metadata }) => {
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
