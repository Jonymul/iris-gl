import { css } from "@emotion/react";
import { HTMLAttributes, useState } from "react";
import { FC } from "react";
import { useAdjustment } from "@iris/react";
import { ParameterControl } from "../../atoms/ParameterControl";
import { ModeSelector } from "../../molecules/ModeSelector";
import { ParameterCarousel } from "../../molecules/ParameterCarousel";

export type EditorControlsProps = HTMLAttributes<HTMLElement>;

export const EditorControls: FC<EditorControlsProps> = (baseProps) => {
  const [selectedParameter, setSelectedParameter] =
    useState<number | undefined>(undefined);
  const [paramValue, setParamValue] = useAdjustment("brightness");

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
      <ParameterControl
        value={paramValue}
        onChange={setParamValue}
        min={-1}
        max={1}
      />
      {/* <ModeSelector /> */}
    </section>
  );
};
