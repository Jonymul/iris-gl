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
      <IrisPreview
        css={css`
          width: 100%;
          height: 400px;
        `}
      />
      <EditorControls />
    </IrisProvider>
  </Fragment>,
  document.getElementById("root")
);
