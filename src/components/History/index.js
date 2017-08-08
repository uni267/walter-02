import React, { Component } from "react";

// material-uis
import { Card, CardTitle, CardText, CardActions } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';

class History extends Component {
  render() {
    const { history, key } = this.props;

    return (
      <Card key={key}>
        <CardTitle
          subtitle={history.modified} />
        <CardText>
          {history.user.name}さんが、
          {history.action}をしました。
          {history.body}でした。
        </CardText>
        <CardActions>
          <RaisedButton label="ダウンロード" onTouchTap={() => console.log("fire")} />
          <RaisedButton label="復元" onTouchTap={() => console.log("fire")} />
        </CardActions>
      </Card>
    );
  }
}

export default History;
