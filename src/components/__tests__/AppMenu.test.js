import React from "react";
import ReactDOM from "react-dom";
import { shallow, mount } from "enzyme";
import AppMenu from "../AppMenu";
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';

injectTapEventPlugin();

describe("Logo.js", () => {
  it("without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(
      <MuiThemeProvider>
      <AppMenu />
      </MuiThemeProvider>,
      div
    );
  });

  it("homeが表示される", () => {
    const wrapper = mount(<MuiThemeProvider><AppMenu /></MuiThemeProvider>);
    const homes = wrapper.find("div")
                         .map(d => d.text())
                         .filter(home => home === "home");
    expect(homes.length).not.toEqual(0);
  });

});
