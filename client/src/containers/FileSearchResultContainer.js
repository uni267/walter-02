import React, { Component } from "react";
import YouAreI from  "youarei";

// store
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

// material ui
import { Card } from "material-ui/Card";

// components
import NavigationContainer from "./NavigationContainer";
import FileSearchContainer from "./FileSearchContainer";
import FileActionContainer from "./FileActionContainer";
import FileListHeader from "../components/FileListHeader";
import Dir from "../components/Dir";
import File from "../components/File";
import FileOperationDialogContainer from "./FileOperationDialogContainer";

// actions
import * as FileActions from "../actions/files";

const styles = {
  title: {
    marginTop: 40,
    marginLeft: 30,
    padding: 5,
    fontSize: 18
  },
  search_summary: {
    marginTop: 20,
    marginLeft: 30,
    padding: 5,
    fontSize: 14,
    color: "rgb(85, 85, 85)"
  },
  table_header_wrap: {
    display: "flex",
    width: "95%",
    marginLeft: 30,
    borderBottom: "1px solid lightgray",
    backgroundColor: "inherit"
  },
  table_header: {
    display: "flex",
    alignItems: "center",
    paddingLeft: 10,
    paddingRight: 24,
    textAlign: "left",
    fontFamily: "Roboto sans-serif",
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    backgroundColor: "inherit",
    color: "rgb(158, 158, 158)",
    fontSize: 12,
    height: 48
  },
  table_row: {
    display: "flex",
    width: "95%",
    marginLeft: 30,
    borderBottom: "1px solid lightgray",
    backgroundColor: "inherit"
  },
  table_cell: {
    display: "flex",
    alignItems: "center",
    paddingLeft: 24,
    paddingRight: 24,
    textAlign: "left",
    fontFamily: "Roboto sans-serif",
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    backgroundColor: "inherit",
    height: 70,
    color: "rgb(80, 80, 80)",
    fontSize: 13
  }
};

const headers = [
  {key: "checkbox", width: "5%", label: ""},
  {key: "name", width: "50%", label: "名前/場所"},
  {key: "modified", width: "20%", label: "最終更新"},
  {key: "dir", width: "15%", label: "メンバー"},
  {key: false, width: "5%", label: "操作"}
];

class FileSearchResultContainer extends Component {
  componentWillMount() {
    this.fetchSearch(this.props);
  }

  componentDidMount() {
    window.addEventListener("scroll", this.onScroll);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.page < nextProps.page) {
      this.fetchSearch(nextProps);
    }

    if (this.props.fileSortTarget !== nextProps.fileSortTarget) {
      this.fetchSearch(nextProps);
    }
  }

  fetchSearch = (props) => {
    const params = new URLSearchParams(props.location.search);
    const query = params.get("q");

    if (query) {
      this.props.actions.fetchSearchFileSimple(
        query, props.page, props.fileSortTarget.sorted, props.fileSortTarget.desc
      );
    }
    else {
      const paramsObject = new YouAreI(props.location.search).query_get();
      this.props.actions.fetchSearchFileDetail(paramsObject, props.page);
    }
  };

  onScroll = (e) => {
    const nextPageThreshold = 100 + (this.props.page + 1) * 30 * 40;

    if (
      window.pageYOffset > nextPageThreshold
      && this.props.files.length < this.props.total
    ) {
      this.props.actions.fileNextPage();
    }
  };

  renderHeaders = () => {
    return headers.map( (header, idx) => (
      <FileListHeader
        { ...this.props }
        key={idx}
        header={header}
        style={styles.table_header} />
    ));
  };

  renderFileIsEmpty = () => {
    return (
      <div style={styles.table_row}>
        <div style={styles.table_cell}></div>
        <div style={styles.table_cell}></div>
        <div style={styles.table_cell}>
          一致したファイル、フォルダが存在しませんでした
        </div>
      </div>
    );
  };

  renderFile = (file, idx) => {
    const dirComponent = (
      <Dir
        { ...this.props }
        key={idx}
        dir={file} 
        rowStyle={styles.table_row}
        cellStyle={styles.table_cell}
        headers={headers} />
    );

    const fileComponent = (
      <File
        { ...this.props }
        key={idx}
        file={file}
        rowStyle={styles.table_row}
        cellStyle={styles.table_cell}
        headers={headers} />
    );
    return file.is_dir ? dirComponent : fileComponent;
  };

  render() {
    return (
      <div>
        <NavigationContainer />

        <Card>

          <div style={{ display: "flex" }}>
            <div style={{ width: "40%" }}>
              <div style={styles.title}>検索結果</div>
              <div style={styles.search_summary}>
                ファイル、フォルダの検索結果 {this.props.files.length} 件
              </div>
            </div>

            <div style={{ width: "60%" }}>
              <FileSearchContainer />
            </div>
          </div>

          <div style={{ display: "flex" }}>
            <div style={{ width: "78%" }}>
              <div style={styles.table_header_wrap}>
                {this.renderHeaders()}
              </div>
              <div style={{ paddingBottom: 30 }}>
                {this.props.files.length === 0
                  ? this.renderFileIsEmpty()
                  : this.props.files.map( ( file, idx) => this.renderFile(file, idx) )
                }
              </div>
            </div>

            <div style={{ width: "22%" }}>
              <FileActionContainer isSearch={true} />
            </div>
          </div>

        </Card>
        <FileOperationDialogContainer />
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    files: state.files,
    tenant: state.tenant,
    total: state.filePagination.total,
    page: state.filePagination.page,
    fileSortTarget: state.fileSortTarget
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  actions: bindActionCreators(FileActions, dispatch)
});

FileSearchResultContainer = connect(
  mapStateToProps, mapDispatchToProps
)(FileSearchResultContainer);

export default FileSearchResultContainer;
