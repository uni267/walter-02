import React, { Component } from "react";

// router
import { withRouter } from "react-router-dom";

// store
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

// components
import AddFilterBtn from "../components/FileSearch/AddFilterBtn";
import SimpleSearch from "../components/FileSearch/SimpleSearch";
import DetailSearch from "../components/FileSearch/DetailSearch";

// actions
import * as FileActions from "../actions/files";

const styles = {
  buttonContainer: {
    display: "flex",
    flexDirection: "row-reverse"
  },
  formContainer: {
    display: "flex",
    flexDirection: "row-reverse",
    flexWrap: "wrap"
  }
};

class FileSearchContainer extends Component {
  componentWillMount() {
    this.props.actions.requestFetchFileSearchItems();
    this.props.actions.requestFetchTags();
  }

  render() {
    return (
      <div style={{marginTop: 10, marginRight: 25, marginBottom: 15}}>

        {/* フィルタ追加ボタン */}
        <div style={styles.buttonContainer}>
          <div>
            <AddFilterBtn { ...this.props } />
          </div>
        </div>

        <div style={styles.formContainer}>
          {/* 簡易検索 */}
          { this.props.isSimple
            ? (
              <SimpleSearch
                {...this.props}
                history={this.props.history}
                hintText="ファイル名を入力"
                />
            ) : null }
            
          {/* 詳細検索 */}
          {this.props.searchItems.map(
              (item, idx) => item.picked ?
              <DetailSearch
                  item={item}
                  key={idx}
                  history={this.props.history}
                  {...this.props} />
                : null
          )}

        </div>
      </div>
    );
  }
};

const mapStateToProps = (state, ownProps) => {
  return {
    tenant: state.tenant,
    searchItems: state.fileDetailSearch.items,
    searchValues: state.fileDetailSearch.searchValues,
    open: state.fileDetailSearch.open,
    anchorElement: state.fileDetailSearch.anchorElement,
    isSimple: state.fileDetailSearch.items.find(item => item.picked) === undefined,
    tags: state.tags
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  actions: bindActionCreators(FileActions, dispatch)
});

FileSearchContainer = connect(
  mapStateToProps, mapDispatchToProps
)(FileSearchContainer);

export default withRouter(FileSearchContainer);
