import React from "react";
import ReactDOM from "react-dom";
import { shallow, mount } from "enzyme";
import FileList from "../FileList";

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';

injectTapEventPlugin();

describe("FileList.js", () => {
  let files;
  let onViewClick;
  
  beforeEach(() => {
    files = [
      {id: 1, name: "file01.txt", is_dir: false}
    ];

    onViewClick = () => {
      return true;
    }
  });

  it("without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(
      <MuiThemeProvider>
        <FileList files={files} onViewClick={onViewClick} />
      </MuiThemeProvider>,
      div
    );
  });

  it("file01が表示される", () => {
    const wrapper = mount(
      <MuiThemeProvider>
        <FileList files={files} onViewClick={onViewClick} />
      </MuiThemeProvider>
    );

    const td = wrapper.find("td").map(td => td.text()).join();
    const regex = new RegExp(files[0].name);
    expect(td.match(regex).length).not.toEqual(0);
  });

});
