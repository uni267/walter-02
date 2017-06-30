import React, { Component } from "react";
import ReactDOM from "react-dom";
import ReactTestUtils from 'react-dom/test-utils';
import { shallow, mount } from "enzyme";
import AddFileDialog from "../AddFileDialog";
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';

injectTapEventPlugin();

describe("AddFileDialog.js", () => {
  let files;
  let open;
  let handleClose;
  let handleUpload;
  let onDrop;

  beforeEach(() => {
    files = [
      {id: 1, name: "file01.txt", is_dir: false},
      {id: 1, name: "file02.txt", is_dir: false},
    ];

    open = true;
    handleClose = () => {};
    handleUpload = () => {};
    onDrop = () => {};
  });

  it("without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(
      <MuiThemeProvider>
        <AddFileDialog
          files={files}
          open={open}
          handleClose={handleClose}
          handleUpload={handleUpload}
          onDrop={onDrop}
        />
      </MuiThemeProvider>,
      div
    );
  });

});
