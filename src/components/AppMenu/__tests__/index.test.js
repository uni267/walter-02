import React from "react";
import ReactDOM from "react-dom";
import ReactTestUtils from 'react-test-renderer/shallow';

import { shallow, mount, render } from "enzyme";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import injectTapEventPlugin from "react-tap-event-plugin";
import { createStore } from "redux";

import AppMenu from "../index";

import reducer from "../../../reducers";

import {
  toggleAddDir,  
  createDir,
  triggerSnackbar
} from "../../../actions";

injectTapEventPlugin();

describe("AppMenu", () => {

  it("without crashing", () => {
    const div = document.createElement("div");

    ReactDOM.render(
      <MuiThemeProvider>
        <AppMenu />
      </MuiThemeProvider>,
      div
    );

  });

});
