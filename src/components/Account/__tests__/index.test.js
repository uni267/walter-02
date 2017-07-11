import React from "react";
import ReactDOM from "react-dom";
import ReactTestUtils from 'react-test-renderer/shallow';

import { shallow, mount, render } from "enzyme";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import injectTapEventPlugin from "react-tap-event-plugin";
import { createStore } from "redux";

import Account from "../index";

import { toggleAccount } from "../../../actions";
import reducer from "../../../reducers";

injectTapEventPlugin();

describe("Account", () => {

  it("without crashing", () => {
    const div = document.createElement("div");
    const store = createStore(reducer);
    const account = store.getState().account;
    const onAccountClick = () => {store.dispatch(toggleAccount())};

    ReactDOM.render(
      <MuiThemeProvider>
        <Account account={account} onAccountClick={onAccountClick} />
      </MuiThemeProvider>,
      div
    );

  });

});

