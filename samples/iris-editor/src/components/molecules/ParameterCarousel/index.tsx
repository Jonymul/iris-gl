import { FC, useMemo } from "react";
import { Carousel } from "../../atoms/Carousel";
import { ParameterChip } from "../../atoms/ParameterChip";
import { ParameterDivider } from "../../atoms/ParameterDivider";

const parameters: (
  | "DIVIDER"
  | { icon: string; label: string; index: number }
)[] = [
  { icon: "crop", label: "Crop", index: 0 },
  "DIVIDER",
  { icon: "light_mode", label: "Brightness", index: 1 },
  { icon: "exposure", label: "Exposure", index: 2 },
  { icon: "tonality", label: "Contrast", index: 3 },
  { icon: "hdr_strong", label: "Highlights", index: 4 },
  { icon: "hdr_weak", label: "Shadows", index: 5 },
  "DIVIDER",
  { icon: "thermostat", label: "Warmth", index: 6 },
  { icon: "colorize", label: "Tint", index: 7 },
  { icon: "invert_colors", label: "Saturation", index: 8 },
  "DIVIDER",
  { icon: "details", label: "Sharpness", index: 9 },
  { icon: "grain", label: "Grain", index: 10 },
  { icon: "vignette", label: "Vignette", index: 11 },
];

export type ParameterCarouselProps = {
  selectedParameter?: number;
  onClickParameter(index: number): void;
};

export const ParameterCarousel: FC<ParameterCarouselProps> = (props) => {
  const { selectedParameter, onClickParameter } = props;
  const hasSelectedItem = useMemo(
    () => selectedParameter !== undefined,
    [selectedParameter]
  );

  return (
    <Carousel
      paddingX={hasSelectedItem ? "50%" : "24px"}
      snap={hasSelectedItem ? "center" : "start"}
      snapSkipConstructors={[ParameterDivider]}
      focusedItem={selectedParameter}
      onFocusedItemChange={onClickParameter}
    >
      {parameters.map((param) =>
        param === "DIVIDER" ? (
          <ParameterDivider />
        ) : (
          <ParameterChip
            variant={
              selectedParameter === undefined
                ? "default"
                : selectedParameter === param.index
                ? "active"
                : "inactive"
            }
            icon={param.icon}
            label={param.label}
            onClick={() => onClickParameter(param.index)}
          />
        )
      )}
    </Carousel>
  );
};
