import { AdjustmentParameter } from "@iris/core";
import { FC, useMemo } from "react";
import { Carousel } from "../../atoms/Carousel";
import { ParameterChip } from "../../atoms/ParameterChip";
import { ParameterDivider } from "../../atoms/ParameterDivider";

type ParameterChipDef = { icon: string; label: string; index: number; parameter: AdjustmentParameter | "crop" }

const parameters: (
  | "DIVIDER"
  | ParameterChipDef
)[] = [
  { icon: "crop", label: "Crop", index: 0, parameter: "crop" },
  "DIVIDER",
  { icon: "light_mode", label: "Brightness", index: 1, parameter: "brightness" },
  { icon: "exposure", label: "Exposure", index: 2, parameter: "exposure" },
  { icon: "tonality", label: "Contrast", index: 3, parameter: "contrast" },
  { icon: "hdr_strong", label: "Highlights", index: 4, parameter: "highlights" },
  { icon: "hdr_weak", label: "Shadows", index: 5, parameter: "shadows" },
  "DIVIDER",
  { icon: "thermostat", label: "Warmth", index: 6, parameter: "warmth" },
  { icon: "colorize", label: "Tint", index: 7, parameter: "tint" },
  { icon: "invert_colors", label: "Saturation", index: 8, parameter: "saturation" },
  "DIVIDER",
  { icon: "details", label: "Sharpness", index: 9, parameter:"sharpness" },
  { icon: "grain", label: "Grain", index: 10, parameter: "grain" },
  { icon: "vignette", label: "Vignette", index: 11, parameter: "vignette" },
];

const parameterIndexes = (parameters.filter(p => p !== "DIVIDER") as ParameterChipDef[]).map(p => p.parameter);

export type ParameterCarouselProps = {
  selectedParameter: AdjustmentParameter | "crop" | "none";
  onClickParameter(parameter: AdjustmentParameter | "crop" | "none"): void;
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
      focusedItem={selectedParameter !== "none" ? parameterIndexes.indexOf(selectedParameter) : undefined}
      onFocusedItemChange={(index) => onClickParameter(parameterIndexes[index] || "none")}
    >
      {parameters.map((param, index) =>
        param === "DIVIDER" ? (
          <ParameterDivider key={index} />
        ) : (
          <ParameterChip
            key={index}
            variant={
              selectedParameter === undefined
                ? "default"
                : selectedParameter === param.parameter
                ? "active"
                : "inactive"
            }
            icon={param.icon}
            label={param.label}
            onClick={() => onClickParameter(param.parameter)}
          />
        )
      )}
    </Carousel>
  );
};
