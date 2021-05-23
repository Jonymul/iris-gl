import { css } from "@emotion/react";
import { FC, HTMLAttributes } from "react";

export type TabMenuItemProps = HTMLAttributes<HTMLButtonElement> & {
  label: string;
  selected?: boolean;
};

export const TabMenuItem: FC<TabMenuItemProps> = (props) => {
  const { label, selected = false, ...baseProps } = props;

  return (
    <button
      css={css`
        background: none;
        color: ${selected ? `#FFFFFF` : "#A7A7A7"};
        border: none;
        font-size: 14px;
        text-transform: uppercase;
        padding: 6px 12px;
        z-index: 1;
        position: relative;
      `}
      {...baseProps}
    >
      {label}
    </button>
  );
};
