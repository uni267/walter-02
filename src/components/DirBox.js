import React, { Component } from "react";
import { Card, CardHeader, CardActions } from "material-ui/Card";
import FlatButton from 'material-ui/FlatButton';

class DirBox extends Component {
  display_dir(dir) {
    return (
      <FlatButton key={dir.id} label={dir.name} />
    );
  }

  render() {
    return (
      <div className="dir-box">
        <Card>
          <CardHeader title="dir-box" />
          <CardActions>
            {this.props.dirs.map(dir => this.display_dir(dir))}
          </CardActions>
        </Card>
      </div>
    );
  }
}

export default DirBox;
