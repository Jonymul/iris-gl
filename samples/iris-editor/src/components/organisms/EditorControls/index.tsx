import { css } from "@emotion/react";
import { FC, useCallback } from "react";
import { ModeSelector } from "../../molecules/ModeSelector";
import { ParameterCarousel } from "../../molecules/ParameterCarousel";

export const EditorControls: FC = (props) => {
  const handleSelectParameter = useCallback((parameterName: string) => {}, []);

  return (
    <section
      title="Editor controls"
      css={css`
        background-color: #232323;
      `}
    >
      <ParameterCarousel onClickParameter={handleSelectParameter} />
      <ModeSelector />
    </section>
  );
};
