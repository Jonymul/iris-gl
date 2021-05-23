import { FC } from "react";
import { Carousel } from "../../atoms/Carousel";
import { ParameterChip } from "../../atoms/ParameterChip";
import { ParameterDivider } from "../../atoms/ParameterDivider";

export type ParameterCarouselProps = {
  onClickParameter(parameterName: string): void;
};

export const ParameterCarousel: FC<ParameterCarouselProps> = (props) => {
  const { onClickParameter } = props;

  return (
    <Carousel snapSkipConstructors={[ParameterDivider]}>
      <ParameterChip
        icon="crop"
        label="Crop"
        onClick={() => onClickParameter("Crop")}
      />
      <ParameterDivider />
      <ParameterChip
        icon="light_mode"
        label="Brightness"
        onClick={() => onClickParameter("Brightness")}
      />
      <ParameterChip
        icon="exposure"
        label="Exposure"
        onClick={() => onClickParameter("Exposure")}
      />
      <ParameterChip
        icon="tonality"
        label="Contrast"
        onClick={() => onClickParameter("Contrast")}
      />
      <ParameterChip
        icon="hdr_strong"
        label="Highlights"
        onClick={() => onClickParameter("Highlights")}
      />
      <ParameterChip
        icon="hdr_weak"
        label="Shadows"
        onClick={() => onClickParameter("Shadows")}
      />
      <ParameterDivider />
      <ParameterChip
        icon="thermostat"
        label="Warmth"
        onClick={() => onClickParameter("Warmth")}
      />
      <ParameterChip
        icon="colorize"
        label="Tint"
        onClick={() => onClickParameter("Tint")}
      />
      <ParameterChip
        icon="invert_colors"
        label="Saturation"
        onClick={() => onClickParameter("Saturation")}
      />
      <ParameterDivider />
      <ParameterChip
        icon="details"
        label="Sharpness"
        onClick={() => onClickParameter("Sharpness")}
      />
      <ParameterChip
        icon="grain"
        label="Grain"
        onClick={() => onClickParameter("Grain")}
      />
      <ParameterChip
        icon="vignette"
        label="Vignette"
        onClick={() => onClickParameter("Vignette")}
      />
    </Carousel>
  );
};
