import React, { Component } from "react";

// mock
import META_INFOS from "../../mock-metaInfos";

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
    paddingBottom: 10,
    paddingTop: 10
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
    const deleteMetaInfo = (file, metaInfo) => {
      this.props.deleteMetaInfo(file, metaInfo);
      this.props.triggerSnackbar("メタ情報を削除しました");
    };

    return (
      <div key={idx} style={styles.row}>
        <div style={{...styles.cell, width: "15%"}}>{meta.key}</div>
        <div style={{...styles.cell, width: "25%"}}>{meta.value}</div>
        <div style={{...styles.cell, width: "10%"}}>
          <RaisedButton
            label="削除"
            onTouchTap={() => deleteMetaInfo(this.props.file, meta) } />
        </div>
      </div>
    );
  };

  newMetaTable = () => {
    const addMetaInfo = (file) => {
      const metaInfo = {
        id: this.state.metaInfo.id,
        key: this.state.metaInfo.value,
        value: this.refs.metaValue.getValue()
      };

      this.props.addMetaInfo(file, metaInfo);
      this.props.triggerSnackbar("メタ情報を追加しました");
      this.setState({ addable: false });
      this.setState({ text: "" });
    };

    const onNewRequest = (searchText) => {
      this.setState({ text: searchText.value });
      this.setState({ metaInfo: searchText });
    };

    const metaInfos = META_INFOS.filter(
      meta => !this.props.file.metaInfo.map(m => m.id).includes(meta.id)
    );

    return (
      <div style={styles.row}>

        <div style={{...styles.cell, width: "15%"}}>

          <AutoComplete
            hintText="キーを選択"
            searchText={this.state.text}
            floatingLabelText="キーを選択"
            onTouchTap={() => this.setState({text: ""})}
            onNewRequest={onNewRequest}
            filter={(searchText, key) => key.indexOf(searchText) !== -1}
            openOnFocus={true}
            dataSource={metaInfos} />
            
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
            onTouchTap={() => addMetaInfo(this.props.file, {}) } />
        </div>
      </div>
    );
  };

  render() {
    return (
      <div>
        {this.props.file.metaInfo.map(
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