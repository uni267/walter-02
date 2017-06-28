import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {BrowserRouter as Router, Route } from 'react-router-dom';

ReactDOM.render(
  <MuiThemeProvider>
    <Router>
      <div>
        <Route exact path="/" component={App} />
      </div>
    </Router>
  </MuiThemeProvider>,
  document.getElementById('root')
);

registerServiceWorker();
