import { css } from "@emotion/react";
import { cloneElement, FunctionComponent, ReactElement, useMemo } from "react";

export type CarouselProps = {
  children: ReactElement[] | ReactElement;
  gap?: number;
  paddingX?: number;
};

export const Carousel: FunctionComponent<CarouselProps> = (props) => {
  const { children, paddingX = 24, gap = 24 } = props;

  const itemArray = useMemo(
    () =>
      (children instanceof Array
        ? [...children]
        : [children]) as ReactElement[],
    [children]
  );

  return (
    <ul
      css={css`
        list-style: none;
        padding: 0;
        display: flex;
        justify-content: start;
        overflow-x: scroll;
        overflow-y: hidden;
        scroll-snap-type: x mandatory;
        scroll-snap-align: start;
        scroll-padding: 24px;

        &:before,
        &:after {
          content: "";
          display: block;
          flex: 0 0 ${paddingX}px;
        }
      `}
    >
      {itemArray.map((item, index) => (
        <li
          key={index}
          css={css`
            flex: 0 0 auto;
            margin-right: ${gap}px;

            &:last-of-type {
              margin-right: 0;
            }
          `}
        >
          {cloneElement(item)}
        </li>
      ))}
    </ul>
  );
};
