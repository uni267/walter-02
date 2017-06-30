import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';

import Logo from "./components/Logo";
import AppMenu from "./components/AppMenu";
import FileBox from "./components/FileBox/";

class App extends Component {
  render() {
    return (
      <div className="App">
          <Logo />
          <Grid fluid>
            <Row>
              <Col xs={5} sm={4} md={3} lg={1}>
                <AppMenu />
              </Col>
              <Col xs={7} sm={8} md={9} lg={11}>
                <FileBox />
              </Col>
            </Row>
          </Grid>
      </div>
    );
  }
}

export default App;
