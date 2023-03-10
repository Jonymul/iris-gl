import { css } from "@emotion/react";
import { IrisPreview, IrisProvider } from "@iris/react";
import { FC, Fragment } from "react";
import { GlobalStyles } from "./lib/GlobalStyles";
import { EditorControls } from "./components/organisms/EditorControls";

export const App: FC = () => {
  return (
    <Fragment>
      <GlobalStyles />
      <IrisProvider>
        <div
          css={css`
            height: 100vh;
            display: flex;
            flex-direction: column;
          `}
        >
          <IrisPreview
            css={css`
              width: 100%;
              flex: 1 1 auto;
              line-height: 0;
            `}
          />
          <EditorControls
            css={css`
              flex: 0 0 auto;
            `}
          />
        </div>
      </IrisProvider>
    </Fragment>
  );
};
