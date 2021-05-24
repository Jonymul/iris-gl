import { css } from "@emotion/react";
import {
  cloneElement,
  FC,
  ReactElement,
  Children,
  useRef,
  useState,
  useEffect,
  HTMLAttributes,
  useMemo,
} from "react";
import { Carousel } from "../Carousel";
import { TabMenuItemProps } from "../TabMenuItem";

export type TabMenuProps = {
  children: ReactElement<TabMenuItemProps>[];
  onTabChange?(index: number): void;
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
  const { onTabChange, children } = props;
  const carouselRef = useRef<HTMLUListElement>(null);
  const [highlightBounds, setHighlightBounds] = useState<{
    width: number;
    left: number;
  }>({ width: 0, left: 0 });

  const highlightedTab = useMemo(() => {
    const i = children.findIndex((child) => child.props.selected);
    return i !== -1 ? i : 0;
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

  return (
    <div>
      <Carousel
        paddingX="50%"
        snap="center"
        snapSkipConstructors={[TabHighlight]}
        ref={carouselRef}
        focusedItem={highlightedTab}
        onFocusedItemChange={onTabChange}
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
