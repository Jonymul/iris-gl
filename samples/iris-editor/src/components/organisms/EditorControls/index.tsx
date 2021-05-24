import { css } from "@emotion/react";
import { useState } from "react";
import { FC } from "react";
import { ModeSelector } from "../../molecules/ModeSelector";
import { ParameterCarousel } from "../../molecules/ParameterCarousel";

export const EditorControls: FC = (props) => {
  const [selectedParameter, setSelectedParameter] =
    useState<number | undefined>(0);

  return (
    <section
      title="Editor controls"
      css={css`
        background-color: #232323;
      `}
    >
      <ParameterCarousel
        selectedParameter={selectedParameter}
        onClickParameter={setSelectedParameter}
      />
      <ModeSelector />
    </section>
  );
};
