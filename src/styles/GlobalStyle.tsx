import { createGlobalStyle } from "styled-components";
import "@fontsource/noto-sans-jp";
import "@fontsource/noto-sans-jp/900.css";
import "@fontsource/noto-sans-jp/700.css";

const GlobalStyle = createGlobalStyle`
  * {
    font-family: "Noto Sans JP", sans-serif;
    overflow: hidden;
  }

  html {
    width: 100%;
    height: 100%;
    background-color: #F3F3F3;
  }

  body {
    width: 100%;
    height: 100%;
  }

  #root {
    width: 100%;
    height: 100%;
  }
`;

export default GlobalStyle;
