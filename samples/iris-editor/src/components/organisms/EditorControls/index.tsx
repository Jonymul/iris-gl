import { css } from "@emotion/react";
import { HTMLAttributes, useState } from "react";
import { FC } from "react";
import { useAdjustment } from "@iris/react";
import { ParameterControl } from "../../atoms/ParameterControl";
import { ModeSelector } from "../../molecules/ModeSelector";
import { ParameterCarousel } from "../../molecules/ParameterCarousel";
import { AdjustmentParameter } from "@iris/core";

export type EditorControlsProps = HTMLAttributes<HTMLElement>;

const AdjustmentControl: FC<{ parameter: AdjustmentParameter }> = (props) => {
  const [paramValue, setParamValue, min, max] = useAdjustment(props.parameter);

  return (
    <ParameterControl
      value={paramValue}
      onChange={setParamValue}
      min={min}
      max={max}
    />
  );
};

export const EditorControls: FC<EditorControlsProps> = (baseProps) => {
  const [selectedParameter, setSelectedParameter] = useState<
    AdjustmentParameter | "crop" | "none"
  >("none");

  return (
    <section
      title="Editor controls"
      css={css`
        background-color: #232323;
      `}
      {...baseProps}
    >
      <ParameterCarousel
        selectedParameter={selectedParameter}
        onClickParameter={setSelectedParameter}
      />
      {selectedParameter === "none" || selectedParameter === "crop" ? (
        <ModeSelector />
      ) : (
        <AdjustmentControl parameter={selectedParameter} />
      )}
    </section>
  );
};
