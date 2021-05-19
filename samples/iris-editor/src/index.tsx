import { css, Global } from "@emotion/react";
import ReactDOM from "react-dom";
import { IrisPreview, IrisProvider } from "@iris/react";
import { Fragment } from "react";
import { GlobalStyles } from "./GlobalStyles";

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
    </IrisProvider>
  </Fragment>,
  document.getElementById("root")
);
