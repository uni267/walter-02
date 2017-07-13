import React, { Component } from "react";

// material-ui
import { Card, CardTitle, CardText } from 'material-ui/Card';
import { Tabs, Tab } from "material-ui/Tabs";
import { Table, TableBody, TableRow, TableRowColumn } from "material-ui/Table";

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

  renderAuthorities(file) {
    return file.authorities.map( (auth, idx) => {
      return <Authority key={idx} auth={auth} />;
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
                <Table selectable={false}>
                  <TableBody
                    selectable={false}
                    displayRowCheckbox={false}>

                    {this.renderAuthorities(file)}

                  </TableBody>
                </Table>
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
