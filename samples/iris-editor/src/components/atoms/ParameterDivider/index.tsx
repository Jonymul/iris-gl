import { css } from "@emotion/react";
import { FunctionComponent } from "react";

export const ParameterDivider: FunctionComponent = (props) => (
  <hr
    css={css`
      width: 1px;
      height: 36px;
      margin-block-start: 12px;
      margin-block-end: 12px;
      background: #5c5c5c;
      border: none;
    `}
  />
);
