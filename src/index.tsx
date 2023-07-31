import * as React from "react";
import ReactDOM from "react-dom";
import ResetStyle from "./styles/ResetStyle";
import GlobalStyle from "./styles/GlobalStyle";
import Pages from "./pages";
import { Path, usePath } from "./contexts/path-context";

const App = () => {
  const path = usePath();
  // console.log("to:", to);
  return (
    <React.StrictMode>
      <Path.Provider value={path}>
        <ResetStyle />
        <GlobalStyle />
        <Pages />
      </Path.Provider>
    </React.StrictMode>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
