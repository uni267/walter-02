import React from "react";
import ReactDOM from "react-dom";
import { shallow, mount } from "enzyme";
import Logo from "../Logo";
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';

injectTapEventPlugin();

describe("Logo.js", () => {
  it("without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(
      <MuiThemeProvider>
      <Logo />
      </MuiThemeProvider>,
      div
    );
  });

  it("walterが表示される", () => {
    const wrapper = mount(<MuiThemeProvider><Logo /></MuiThemeProvider>);
    const h1 = wrapper.find("h1");
    expect(h1.text()).toEqual("walter");
  });

});
