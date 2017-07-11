import React from "react";
import ReactDOM from "react-dom";
import ReactTestUtils from 'react-test-renderer/shallow';

import { shallow, mount, render } from "enzyme";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import injectTapEventPlugin from "react-tap-event-plugin";
import { createStore } from "redux";

import AddDirDialog from "../index";

import reducer from "../../../reducers";

import {
  toggleAddDir,  
  createDir,
  triggerSnackbar
} from "../../../actions";

injectTapEventPlugin();

describe("AddDirDialog", () => {

  it("without crashing", () => {
    const div = document.createElement("div");

    const store = createStore(reducer);

    const dir_id = 0;
    const toggleAddDir = () => { store.dispatch(toggleAddDir()); };
    const createDir = () => { store.dispatch(createDir()); };
    const open = store.getState().addDir.open;
    const triggerSnackbar = () => { store.dispatch(triggerSnackbar()); };

    ReactDOM.render(
      <MuiThemeProvider>
        <AddDirDialog
          dir_id={dir_id}
          toggleAddDir={toggleAddDir}
          createDir={createDir}
          open={open}
          triggerSnackbar={triggerSnackbar} />
      </MuiThemeProvider>,
      div
    );

  });

});

