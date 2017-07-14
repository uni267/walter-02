import React, { Component } from "react";

// material-ui
import { Card, CardTitle, CardText } from 'material-ui/Card';
import { Tabs, Tab } from "material-ui/Tabs";

// components
import BasicInfo from "./BasicInfo";
import History from "./History";
import Authority from "./Authority";

const styles = {
  innerCard: {
    marginTop: 10,
    marginLeft: 30,
    marginRight: 30,
    marginBottom: 30,
    paddingBottom: 20
  }
};

class FileDetail extends Component {

  renderHistories(file) {
    return file.histories.map( (history, idx) => {
      return <History key={idx} history={history} />;
    });
  }

  render() {
    const { file } = this.props;

    return (
      <Card style={{paddingBottom: 10}}>
        <CardTitle title="ファイル詳細" subtitle={file.name} />
        <Card style={styles.innerCard}>
          <CardText>
            <Tabs>
              <Tab label="基本情報">
                <BasicInfo file={file} />
              </Tab>
              <Tab label="権限">
                <Authority file={file} />
              </Tab>
              <Tab label="履歴情報">
                {this.renderHistories(file)}
              </Tab>
            </Tabs>
          </CardText>
        </Card>
      </Card>
    );
  }
}

export default FileDetail;
