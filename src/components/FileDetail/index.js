import React, { Component } from "react";

// material-ui
import { Card, CardTitle, CardText, CardMedia } from 'material-ui/Card';
import { Tabs, Tab } from "material-ui/Tabs";

// components
import BasicInfo from "./BasicInfo";
import History from "./History";
import Authority from "./Authority";

const styles = {
  fileImageWrapper: {
    display: "flex"
  },
  innerCard: {
    marginTop: 10,
    marginLeft: 15,
    marginRight: 15
  }
};

class FileDetail extends Component {

  renderHistories(file) {
    return file.histories.map( (history, idx) => {
      return <History key={idx} history={history} />;
    });
  }

  render() {
    const cardOverlay = (
      <CardTitle subtitle={this.props.file.name} />
    );

    return (
      <Card style={{paddingBottom: 10}}>
        <CardTitle title="ファイル詳細" subtitle={this.props.file.name} />
        <div style={styles.fileImageWrapper}>

          <Card style={styles.innerCard}>
            <CardMedia overlay={cardOverlay}>
              <img src="/images/baibaikihon.png" />
            </CardMedia>
          </Card>

          <Card style={styles.innerCard}>
            <CardText>
              {this.renderHistories(this.props.file)}
            </CardText>
          </Card>

        </div>
      </Card>
    );
  }
}

export default FileDetail;
