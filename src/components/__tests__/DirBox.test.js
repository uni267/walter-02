import React from "react";
import ReactDOM from "react-dom";
import { shallow, mount } from "enzyme";
import DirBox from "../DirBox";
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';

injectTapEventPlugin();

describe("DirBox.js", () => {
  let dirs;

  beforeEach(() => {
    dirs = [
      {id: 1, name: "dir01"},
      {id: 2, name: "dir02"},
    ];
  });

  it("without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(
      <MuiThemeProvider>
        <DirBox dirs={dirs} />
      </MuiThemeProvider>,
      div
    );
  });

  it("ディレクトリ名が表示される", () => {
    const wrapper = mount(
      <MuiThemeProvider>
        <DirBox dirs={dirs} />
      </MuiThemeProvider>
    );

    const spans = wrapper.find("span")
                         .map(s => s.text())
                         .join();

    const regex = new RegExp(dirs[0].name);
    expect(spans.match(regex).length).not.toEqual(0);

  });

});
