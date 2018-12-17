import React from "react";
import styled from "styled-components";

type Props = {
  data: string;
  mediaType: "image/png" | "image/jpeg" | "image/gif";
  metadata: any;
};

const ImageStyle = styled.img`
  display: block;
  max-width: 100%;
`;

export function Image(props: Props) {
  let size = {};

  if (props.metadata) {
    const { width, height } = props.metadata;
    size = { width, height };
  }

  return (
    <React.Fragment>
      <ImageStyle
        alt=""
        src={`data:${props.mediaType};base64,${props.data}`}
        {...size}
      />
    </React.Fragment>
  );
}

Image.defaultProps = {
  data: "",
  mediaType: "image/jpeg"
};
