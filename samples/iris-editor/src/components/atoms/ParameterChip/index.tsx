import { css } from "@emotion/react";
import { FC, HTMLAttributes } from "react";
import { Icon } from "../Icon";

export type ParameterChipProps = HTMLAttributes<HTMLButtonElement> & {
  label: string;
  icon: string;
};

export const ParameterChip: FC<ParameterChipProps> = (props) => {
  const { label, icon, ...baseProps } = props;

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
      {...baseProps}
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
          font-size: 12px;
          font-weight: regular;
          text-align: center;
          text-overflow: visible;
          text-transform: uppercase;
        `}
      >
        {label}
      </div>
    </button>
  );
};
