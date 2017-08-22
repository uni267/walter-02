import React, { Component } from "react";

// material-uis
import TextField from "material-ui/TextField";

const styles = {
  innerCard: {
    marginTop: 10,
    marginLeft: 30,
    marginRight: 30,
    marginBottom: 30,
    paddingBottom: 20
  },
  basicInfo: {
    marginTop: 10,
    marginLeft: 20
  }
};

class BasicInfo extends Component {
  render() {
    const { file } = this.props;

    return (
      <div>
        <TextField style={styles.basicInfo}
                   floatingLabelText="ファイル名"
                   defaultValue={file.name} />
        <br />

        <TextField style={styles.basicInfo}
                   floatingLabelText="お気に入り"
                   defaultValue={file.is_star} />
        <br />

        <TextField style={styles.basicInfo}
                   floatingLabelText="最終更新"
                   value={file.modified} />
        <br />

        <TextField style={styles.basicInfo}
                   floatingLabelText="所有者"
                   value={file.owner} />
        <br />
      </div>
    );
  }
}

export default BasicInfo;
