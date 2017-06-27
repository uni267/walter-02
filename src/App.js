import React, { Component } from 'react';
import axios from "axios";
import { Card } from "material-ui/Card";
import injectTapEventPlugin from 'react-tap-event-plugin';

import Logo from "./components/Logo";
import FileBox from "./components/FileBox";

injectTapEventPlugin();
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      files: [],
    };
  }

  componentWillMount() {
    this.get_files();
  }

  get_files() {
    const url = "http://localhost:3333";
    axios.get(url)
         .then((res) => {
           this.setState({files: res.data});
           console.log(this.state.files);
         })
         .catch((error) => {
           console.log(error);
         });
  }

  render() {
    return (
      <Card>
        <div className="App">
          <Logo />
          <FileBox files={this.state.files} />
        </div>
      </Card>
    );
  }
}

export default App;
