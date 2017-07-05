import React, { Component } from 'react';

// material
import injectTapEventPlugin from 'react-tap-event-plugin';

// app components
import Logo from "./components/Logo";
import AppMenu from "./components/AppMenu";
import FileBoxContainer from "./containers/FileBox";

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
    this.setState({menuOpen: !this.state.menuOpen});
  }

  render() {
    const getDirId = () => {
      const params = new URLSearchParams(this.props.location.search);
      return (params.get("dir_id") === null) ?
        0 : params.get("dir_id");
    };

    return (
      <div className="App">
        <Logo toggleMenu={this.toggleMenu} />
        <AppMenu
          open={this.state.menuOpen}
          toggleMenu={this.toggleMenu}
        />
        <FileBoxContainer dir_id={getDirId()}/>
      </div>
    );
  }
}

export default App;
