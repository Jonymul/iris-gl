import { FunctionComponent } from "react";
import { Carousel } from "../../atoms/Carousel";
import { ParameterChip } from "../../atoms/ParameterChip";
import { ParameterDivider } from "../../atoms/ParameterDivider";

export const ParameterCarousel: FunctionComponent = (props) => {
  return (
    <Carousel>
      <ParameterChip icon="crop" label="Crop" />
      <ParameterDivider />
      <ParameterChip icon="light_mode" label="Brightness" />
      <ParameterChip icon="exposure" label="Exposure" />
      <ParameterChip icon="tonality" label="Contrast" />
      <ParameterChip icon="tonality" label="Highlights" />
      <ParameterChip icon="tonality" label="Shadows" />
      <ParameterDivider />
      <ParameterChip icon="thermostat" label="Warmth" />
      <ParameterChip icon="colorize" label="Tint" />
      <ParameterChip icon="palette" label="Saturation" />
    </Carousel>
  );
};
