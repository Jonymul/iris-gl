import { css } from "@emotion/react";
import { FunctionComponent } from "react";
import { Icon } from "../Icon";

export type ParameterChipProps = {
  label: string;
  icon: string;
};

export const ParameterChip: FunctionComponent<ParameterChipProps> = (props) => {
  const { label, icon } = props;

  return (
    <button
      css={css`
        border: 0;
        background: transparent;
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 56px;
      `}
    >
      <Icon
        icon={icon}
        size={24}
        css={css`
          background: #313131;
          border-radius: 50%;
          padding: 16px;
        `}
      />
      <div
        css={css`
          margin-top: 10px;
          font-size: 14px;
          font-weight: 600;
          text-align: center;
          text-overflow: visible;
        `}
      >
        {label}
      </div>
    </button>
  );
};
