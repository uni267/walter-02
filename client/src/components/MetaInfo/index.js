import React, { Component } from "react";

// material ui
import RaisedButton from "material-ui/RaisedButton";
import AutoComplete from "material-ui/AutoComplete";
import TextField from "material-ui/TextField";

const styles = {
  row: {
    display: "flex"
  },
  cell: {
    display: "flex",
    alignItems: "center",
    borderBottom: "1px solid lightgray",
    textAlign: "left",
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    height: 45,
    paddingLeft: 24,
    paddingRight: 24,
    paddingBottom: 5,
    paddingTop: 15
  }
};

class MetaInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addable: false,
      text: "",
      metaInfo: null
    };
  }

  renderMetaInfo = (meta, idx) => {
    const deleteMetaInfoToFile = (file, metaInfo) => {
      this.props.deleteMetaInfoToFile(file, metaInfo);
      this.props.triggerSnackbar("メタ情報を削除しました");
    };

    return (
      <div key={idx} style={styles.row}>
        <div style={{...styles.cell, width: "15%"}}>{meta.key}</div>
        <div style={{...styles.cell, width: "25%"}}>{meta.value}</div>
        <div style={{...styles.cell, width: "10%"}}>
          <RaisedButton
            label="削除"
            onTouchTap={() => deleteMetaInfoToFile(this.props.file, meta) } />
        </div>
      </div>
    );
  };

  newMetaTable = () => {
    const addMetaInfoToFile = (file) => {
      this.props.addMetaInfoToFile(
        file,
        this.state.metaInfo,
        this.refs.metaValue.getValue()
      );

      this.setState({ addable: false });
      this.setState({ text: "" });
    };

    const onNewRequest = (searchText) => {
      this.setState({ text: searchText.key });
      this.setState({ metaInfo: searchText });
    };

    const dataSourceConfig = {
      text: "key",
      value: "_id"
    };

    return (
      <div style={styles.row}>

        <div style={{...styles.cell, width: "15%"}}>

          <AutoComplete
            hintText="キーを選択"
            searchText={this.state.text}
            floatingLabelText="キーを選択"
            onTouchTap={() => this.setState({text: ""})}
            onNewRequest={onNewRequest}
            filter={AutoComplete.noFilter}
            openOnFocus={true}
            dataSource={this.props.metaInfo}
            dataSourceConfig={dataSourceConfig}
            />
            
        </div>
        <div style={{...styles.cell, width: "25%"}}>

          <TextField
            ref="metaValue"
            hintText="値を入力"
            floatingLabelText="値を入力" />

        </div>
        <div style={{...styles.cell, width: "10%"}}>
          <RaisedButton
            label="作成"
            onTouchTap={() => addMetaInfoToFile(this.props.file, {}) } />
        </div>
      </div>
    );
  };

  render() {
    return (
      <div>
        {this.props.file.meta_infos.map(
          (meta, idx) => this.renderMetaInfo(meta, idx)
        )}

        {this.state.addable ? this.newMetaTable() : null}

        <div style={{ marginTop: 20 }}>

          <RaisedButton
            label="追加"
            onTouchTap={() => this.setState({ addable: true })} />

        </div>
      </div>
    );
  }
}

export default MetaInfo;
