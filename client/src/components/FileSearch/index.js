import React, { Component } from "react";
import PropTypes from "prop-types";

// components
import AddFilterBtn from "./AddFilterBtn";
import SimpleSearch from "./SimpleSearch";
import DetailSearch from "./DetailSearch";

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

class FileSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      anchorEl: {},
      searchItems: [
        {
          id: 1,
          label: "ファイル名",
          type: "string",
          picked: false
        },
        {
          id: 2,
          label: "お気に入り",
          type: "boolean",
          picked: false
        },
        {
          id: 3,
          label: "最終更新日",
          type: "date",
          picked: false
        }
      ]
    };

  }

  handleOpen = (event) => {
    event.preventDefault();

    this.setState({
      open: true,
      anchorEl: event.currentTarget
    });
  }

  handleClose = () => {
    this.setState({
      open: false
    });
  }

  handleChange = (e) => {
    this.props.searchFile(e.target.value);
  }

  handleMenuTouchTap = (menu) => {
    this.setState({
      searchItems: this.state.searchItems.map(item => {
        return item.id === menu.id ? {...item, picked: true} : item;
      })
    });
  };

  handleDelete = (menu) => {
    this.setState({
      searchItems: this.state.searchItems.map(m => {
        return m.id === menu.id ? {...m, picked: false} : m;
      })
    });
  };

  render() {

    const isSimple = this.state.searchItems.filter(item => item.picked).length === 0;

    return (
      <div style={{marginTop: 10, marginRight: 25, marginBottom: 15}}>

        {/* フィルタ追加ボタン */}
        <div style={styles.buttonContainer}>
          <div>
            <AddFilterBtn
              searchItems={this.state.searchItems}
              open={this.state.open}
              anchorEl={this.state.anchorEl}
              handleOpen={this.handleOpen}
              handleClose={this.handleClose}
              handleMenuTouchTap={this.handleMenuTouchTap}
              />
          </div>
        </div>

        <div style={styles.formContainer}>
          {/* 簡易検索 */}
          { isSimple ?
            <SimpleSearch
                searchWord={this.props.searchWord}
                handleChange={this.handleChange}
                />
            : null }
            
          {/* 詳細検索 */}
          {this.state.searchItems.map(
              (menu, idx) => menu.picked ?
              <DetailSearch menu={menu} key={idx} handleDelete={this.handleDelete} />
                : null
          )}

        </div>
      </div>
    );
  }
};

FileSearch.propTypes = {
  searchWord: PropTypes.object.isRequired,
  searchFile: PropTypes.func.isRequired
};

export default FileSearch;
