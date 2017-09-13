import React, { Component } from "react";

// store
import { connect } from "react-redux";

// components
import AddFilterBtn from "../components/FileSearch/AddFilterBtn";
import SimpleSearch from "../components/FileSearch/SimpleSearch";
import DetailSearch from "../components/FileSearch/DetailSearch";

// actions
import {
  searchFileSimple,
  searchFileDetail,
  requestFetchFileSearchItems,
  toggleFileDetailSearchPopover,
  fileDetailSearchAnchorElement,
  searchItemPick,
  searchItemNotPick,
  searchValueChange
} from "../actions";

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
    this.props.requestFetchFileSearchItems(this.props.tenant.tenant_id);
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
            ? <SimpleSearch {...this.props} hintText="ファイル名を入力" />
            : null }
            
          {/* 詳細検索 */}
          {this.props.searchItems.map(
              (item, idx) => item.picked ?
              <DetailSearch
                  item={item}
                  key={idx}
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
    isSimple: state.fileDetailSearch.items.find(item => item.picked) === undefined
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  searchFileSimple: (value) => dispatch(searchFileSimple(value)),
  searchFileDetail: () => dispatch(searchFileDetail()),
  requestFetchFileSearchItems: (tenant_id) => {
    dispatch(requestFetchFileSearchItems(tenant_id));
  },
  toggleFileDetailSearchPopover: () => dispatch(toggleFileDetailSearchPopover()),
  fileDetailSearchAnchorElement: (event) => dispatch(fileDetailSearchAnchorElement(event)),
  searchItemPick: (item) => dispatch(searchItemPick(item)),
  searchItemNotPick: (item) => dispatch(searchItemNotPick(item)),
  searchValueChange: (item, value) => dispatch(searchValueChange(item, value))
});

FileSearchContainer = connect(mapStateToProps, mapDispatchToProps)(FileSearchContainer);

export default FileSearchContainer;
