import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';

// store
import { createStore, applyMiddleware } from "redux";
import reducer from "./reducers";
import { Provider } from "react-redux";
import logger from "redux-logger";

// material
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';

// app components
import App from './App';

// router
import { BrowserRouter as Router, Route } from 'react-router-dom';

const store = createStore(reducer, applyMiddleware(logger));

injectTapEventPlugin();

ReactDOM.render(
  <MuiThemeProvider>
    <Router>
      <Provider store={store}>
        <Route exact path="/" component={App} />
      </Provider>
    </Router>
  </MuiThemeProvider>,
  document.getElementById('root')
);

registerServiceWorker();
