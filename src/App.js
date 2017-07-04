import React, { Component } from 'react';
import Logo from "./components/Logo";
import AppMenu from "./components/AppMenu";
import FileBox from "./components/FileBox/";
import injectTapEventPlugin from 'react-tap-event-plugin';

injectTapEventPlugin();

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menuOpen: false
    };
    this.toggleMenu = this.toggleMenu.bind(this);
  }

  toggleMenu() {
    console.log("toggle menu!!");
    this.setState({menuOpen: !this.state.menuOpen});
  }

  render() {
    return (
      <div className="App">
        <Logo toggleMenu={this.toggleMenu} />
        <AppMenu
          open={this.state.menuOpen}
          toggleMenu={this.toggleMenu}
        />
        <FileBox />
      </div>
    );
  }
}

export default App;
