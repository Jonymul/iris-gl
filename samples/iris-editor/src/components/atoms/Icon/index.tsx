import { css } from "@emotion/react";
import { FunctionComponent, HTMLAttributes } from "react";

export type IconSize = 18 | 24 | 36 | 48;

export type IconProps = HTMLAttributes<HTMLDivElement> & {
  icon: string;
  size?: IconSize;
};

export const Icon: FunctionComponent<IconProps> = (props) => {
  const { icon, size = 24, className, ...baseProps } = props;
  return (
    <div
      className={["material-icons", className].join(" ")}
      css={css`
        font-size: ${size}px;
      `}
      role="presentation"
      {...baseProps}
    >
      {icon}
    </div>
  );
};
