import React from "react";
import ReactDOM from "react-dom";

import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import injectTapEventPlugin from "react-tap-event-plugin";

import Account from "../index";

injectTapEventPlugin();

describe("Account", () => {

  it("without crashing", () => {
    const div = document.createElement("div");
    const account = { open: false };
    const onAccountClick = () => { return true; };

    ReactDOM.render(
      <MuiThemeProvider>
        <Account account={account} onAccountClick={onAccountClick} />
      </MuiThemeProvider>,
      div
    );

  });

});

