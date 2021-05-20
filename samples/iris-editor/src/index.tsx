import { css, Global } from "@emotion/react";
import ReactDOM from "react-dom";
import { IrisPreview, IrisProvider } from "@iris/react";
import { Fragment } from "react";
import { GlobalStyles } from "./GlobalStyles";
import { ParameterCarousel } from "./components/molecules/ParameterCarousel";

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
      <ParameterCarousel />
    </IrisProvider>
  </Fragment>,
  document.getElementById("root")
);
