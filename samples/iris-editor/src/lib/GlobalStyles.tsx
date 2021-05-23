import { css, Global } from "@emotion/react";
import { FC } from "react";

export const GlobalStyles: FC = () => (
  <Global
    styles={css`
      body {
        background-color: #111111;
        color: #ffffff;
        margin: 0;
        font-family: "Saira", -apple-system, BlinkMacSystemFont, "Segoe UI",
          "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans",
          "Helvetica Neue", sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }

      button {
        color: inherit;
        font-family: inherit;
        font-weight: inherit;
      }
    `}
  />
);
