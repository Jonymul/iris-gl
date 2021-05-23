import { css } from "@emotion/react";
import {
  cloneElement,
  FC,
  ReactElement,
  Children,
  useRef,
  useLayoutEffect,
  useCallback,
  useState,
  useEffect,
  HTMLAttributes,
} from "react";
import { Carousel } from "../Carousel";
import { TabMenuItemProps } from "../TabMenuItem";

export type TabMenuProps = {
  children: ReactElement<TabMenuItemProps>[];
};

const TabHighlight: FC<HTMLAttributes<HTMLDivElement>> = (baseProps) => (
  <div
    css={css`
      background-color: #313131;
      border-radius: 100px;
      height: 36px;
      min-width: 36px;
      position: absolute;
      top: 22px;
    `}
    {...baseProps}
  />
);

export const TabMenu: FC<TabMenuProps> = (props) => {
  const { children } = props;
  const [highlightedTab, setHighlightedTab] = useState<number>(0);
  const [highlightBounds, setHighlightBounds] = useState<{
    width: number;
    left: number;
  }>({ width: 0, left: 0 });
  const carouselRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const i = children.findIndex((child) => child.props.selected);
    setHighlightedTab(i !== -1 ? i : 0);
  }, [children]);

  useEffect(() => {
    if (carouselRef.current === null) {
      return;
    }

    const targetChild = carouselRef.current.children[
      highlightedTab
    ] as HTMLElement;
    setHighlightBounds({
      width: targetChild.clientWidth,
      left: targetChild.offsetLeft,
    });
  }, [highlightedTab]);

  const handleScroll = useCallback(
    (e: Event) => {
      const target = e.currentTarget as HTMLUListElement;
      const currentVisualCenter = target.scrollLeft + target.clientWidth / 2;
      const children = target.children;
      let closestIndex = 0;
      let closestPosition = -1;

      [...children].splice(0, children.length - 1).forEach((child, i) => {
        let childE = child as HTMLElement;
        const left = childE.offsetLeft + childE.clientWidth / 2;
        const offset = Math.abs(currentVisualCenter - left);
        if (closestPosition === -1 || offset < closestPosition) {
          closestIndex = i;
          closestPosition = offset;
        }
      });

      if (closestIndex !== highlightedTab) {
        setHighlightedTab(closestIndex);
        navigator.vibrate(10);
      }
    },
    [highlightedTab]
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
    <div>
      <Carousel
        paddingX="50%"
        snap="center"
        snapSkipConstructors={[TabHighlight]}
        ref={carouselRef}
        _highlightIndicator={
          <TabHighlight
            css={css`
              width: ${highlightBounds.width}px;
              left: ${highlightBounds.left}px;
              transition: width linear 0.2s, left linear 0.2s;
            `}
          />
        }
        css={css`
          position: relative;
        `}
      >
        {Children.map([...children], (child, index) =>
          cloneElement(child, {
            selected: index === highlightedTab,
          })
        )}
      </Carousel>
    </div>
  );
};
