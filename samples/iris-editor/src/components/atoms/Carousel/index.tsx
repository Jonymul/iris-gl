import { css } from "@emotion/react";
import {
  Fragment,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import mergeRefs from "react-merge-refs";
import {
  cloneElement,
  FC,
  forwardRef,
  HTMLAttributes,
  ReactElement,
  useMemo,
} from "react";
import { useEffect } from "react";

export type CarouselProps = HTMLAttributes<HTMLUListElement> & {
  children: ReactElement[] | ReactElement;
  snap?: "start" | "center";
  gap?: string;
  paddingX?: string;
  paddingY?: string;
  snapSkipConstructors?: FC[];
  focusedItem?: number;
  onFocusedItemChange?(index: number): void;
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
      focusedItem,
      onFocusedItemChange,
      _highlightIndicator,
      ...baseProps
    } = props;
    const carouselRef = useRef<HTMLUListElement>(null);
    const [internalFocusedItem, setInternalFocusedItem] = useState(focusedItem);

    const itemArray = useMemo(
      () =>
        (children instanceof Array
          ? [...children]
          : [children]) as ReactElement[],
      [children]
    );

    const ignoredItemIndeces = useMemo(
      () =>
        itemArray
          .map((i, index) =>
            snapSkipConstructors?.some((c) => c === i.type) ? index : undefined
          )
          .filter(Number) as number[],
      [itemArray, snapSkipConstructors]
    );

    // Handle change of external focusedItem prop
    useEffect(() => {
      if (
        focusedItem === undefined ||
        focusedItem === internalFocusedItem ||
        carouselRef.current === null
      ) {
        return;
      }

      const targetIndex =
        focusedItem +
        itemArray
          .slice(0, focusedItem)
          .filter((_, i) => ignoredItemIndeces.some((i3) => i3 === i)).length;

      const elementToFocus = carouselRef.current.children[
        targetIndex
      ] as HTMLLIElement;
      if (elementToFocus === undefined) {
        return;
      }

      if (snap === "center") {
        carouselRef.current.scrollLeft =
          elementToFocus.offsetLeft +
          elementToFocus.clientWidth / 2 -
          carouselRef.current.clientWidth / 2;
      } else {
        carouselRef.current.scrollLeft = elementToFocus.offsetLeft;
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [focusedItem, itemArray, snapSkipConstructors]);

    const handleScroll = useCallback(
      (e: Event) => {
        const target = e.currentTarget as HTMLUListElement;
        const currentVisualCenter = target.scrollLeft + target.clientWidth / 2;
        const children = target.children;
        let closestIndex = 0;
        let closestPosition = -1;

        [...children]
          .filter((c, i) => !ignoredItemIndeces.some((i3) => i3 === i))
          .splice(0, children.length - 1)
          .forEach((child, i) => {
            let childE = child as HTMLElement;
            const left = childE.offsetLeft + childE.clientWidth / 2;
            const offset = Math.abs(currentVisualCenter - left);
            if (closestPosition === -1 || offset < closestPosition) {
              closestIndex = i;
              closestPosition = offset;
            }
          });

        if (closestIndex !== internalFocusedItem) {
          setInternalFocusedItem(closestIndex);
          navigator.vibrate(10);
          if (onFocusedItemChange !== undefined) {
            onFocusedItemChange(closestIndex);
          }
        }
      },
      [ignoredItemIndeces, internalFocusedItem, onFocusedItemChange]
    );

    useLayoutEffect(() => {
      const carouselElem = carouselRef.current;
      if (carouselElem === null) {
        return;
      }

      carouselElem.addEventListener("scroll", handleScroll, { passive: true });
      return () => {
        carouselElem.removeEventListener("scroll", handleScroll);
      };
    }, [handleScroll]);

    return (
      <Fragment>
        <ul
          css={css`
            scroll-behavior: smooth;
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
          ref={mergeRefs([carouselRef, ref])}
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
      </Fragment>
    );
  }
);
