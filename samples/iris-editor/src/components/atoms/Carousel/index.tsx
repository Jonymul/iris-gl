import { css } from "@emotion/react";
import {
  cloneElement,
  FC,
  forwardRef,
  HTMLAttributes,
  ReactElement,
  useMemo,
} from "react";

export type CarouselProps = HTMLAttributes<HTMLUListElement> & {
  children: ReactElement[] | ReactElement;
  snap?: "start" | "center";
  gap?: string;
  paddingX?: string;
  paddingY?: string;
  snapSkipConstructors?: FC[];
  _highlightIndicator?: ReactElement;
};

export const Carousel = forwardRef<HTMLUListElement, CarouselProps>(
  (props, ref) => {
    const {
      children,
      snap = "start",
      paddingX = "24px",
      paddingY = "24px",
      gap = "24px",
      snapSkipConstructors,
      _highlightIndicator,
      ...baseProps
    } = props;

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
          margin: 0;
          overflow-x: scroll;
          overflow-y: hidden;
          scroll-snap-type: x mandatory;
          scroll-padding: ${snap !== "center" ? paddingX : null};

          &:before,
          &:after {
            content: "";
            display: block;
            flex: 0 0 ${paddingX};
          }
        `}
        ref={ref}
        {...baseProps}
      >
        {itemArray.map((item, index) => {
          const isIgnoredConstructor = snapSkipConstructors?.some(
            (c) => c === item.type
          );

          return (
            <li
              key={index}
              role={isIgnoredConstructor ? "presentation" : undefined}
              css={css`
                flex: 0 0 auto;
                margin-right: ${gap};
                margin-top: ${paddingY};
                margin-bottom: ${paddingY};
                scroll-snap-align: ${!isIgnoredConstructor ? snap : null};

                &:last-child {
                  margin-right: 0;
                }
              `}
            >
              {cloneElement(item)}
            </li>
          );
        })}
        {_highlightIndicator !== undefined ? (
          <li>{_highlightIndicator}</li>
        ) : null}
      </ul>
    );
  }
);
