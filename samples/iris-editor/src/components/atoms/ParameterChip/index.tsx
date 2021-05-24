import { css } from "@emotion/react";
import { FC, HTMLAttributes } from "react";
import { Icon } from "../Icon";

export type ParameterChipProps = HTMLAttributes<HTMLButtonElement> & {
  label: string;
  icon: string;
  variant?: "default" | "active" | "inactive";
};

const parameterChipColors = {
  default: {
    background: "#313131",
    icon: "white",
    label: "white",
  },
  active: {
    background: "#61C781",
    icon: "#111111",
    label: "white",
  },
  inactive: {
    background: "transparent",
    icon: "white",
    label: "#A7A7A7",
  },
};

export const ParameterChip: FC<ParameterChipProps> = (props) => {
  const { label, icon, variant = "default", ...baseProps } = props;

  const selectedColors = parameterChipColors[variant];

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
          background: ${selectedColors.background};
          color: ${selectedColors.icon};
          border-radius: 50%;
          padding: 16px;
        `}
      />
      <div
        css={css`
          color: ${selectedColors.label};
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
