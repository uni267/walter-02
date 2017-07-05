import React, { Component } from 'react';

// material
import injectTapEventPlugin from 'react-tap-event-plugin';

// store
import { connect } from "react-redux";

// app components
import Logo from "./components/Logo";
import AppMenu from "./components/AppMenu";
import FileBox from "./components/FileBox/";

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
        <FileBox dir_id={getDirId()}/>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {state};
};

App = connect(mapStateToProps)(App);

export default App;
