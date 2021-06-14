import { css } from "@emotion/react";
import ReactDOM from "react-dom";
import { IrisPreview, IrisProvider } from "@iris/react";
import { Fragment } from "react";
import { GlobalStyles } from "./lib/GlobalStyles";
import { EditorControls } from "./components/organisms/EditorControls";

ReactDOM.render(
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
            display: flex;
            line-height: 0;
            align-items: center;
            justify-content: center;
          `}
        />
        <EditorControls
          css={css`
            flex: 0 0 auto;
          `}
        />
      </div>
    </IrisProvider>
  </Fragment>,
  document.getElementById("root")
);
