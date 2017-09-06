import React, { Component } from "react";

// route
import { Link, withRouter } from "react-router-dom";

// store
import { connect } from "react-redux";

// material
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardText, 
  CardMedia, 
  CardActions
} from 'material-ui/Card';

// components
import NavigationContainer from "./NavigationContainer";

class GroupCreateContainer extends Component {
  render() {
    return (
      <div>
        <NavigationContainer />
        group cretate container
      </div>
    );
  }
}

export default GroupCreateContainer;
