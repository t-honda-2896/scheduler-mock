import * as React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import ResetStyle from "./styles/ResetStyle";
import GlobalStyle from "./styles/GlobalStyle";
import Pages from "./pages";

const App = () => {
  return (
    <BrowserRouter>
      <ResetStyle />
      <GlobalStyle />
      <Switch>
        <Route path="/">
          <Pages />
        </Route>
        <Redirect to="/" />
      </Switch>
    </BrowserRouter>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
