import React, { Component } from "react";

// material ui
import TextField from "material-ui/TextField";
import DatePicker from 'material-ui/DatePicker';
import SelectField from 'material-ui/SelectField';
import RaisedButton from 'material-ui/RaisedButton';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from "material-ui/IconButton";

// material icon
import ContentRemoveCircleOutline from "material-ui/svg-icons/content/remove-circle-outline";

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

  handleTouchTap = (event) => {
    event.preventDefault();

    this.setState({
      open: true,
      anchorEl: event.currentTarget
    });
  }

  handleRequestClose = () => {
    this.setState({
      open: false
    });
  }

  handleChange = (e) => {
    this.props.searchFile(e.target.value);
  }

  renderMenu(menu, idx) {

    const onTouchTapMenu = (menu) => {
      this.setState({
        searchItems: this.state.searchItems.map(m => {
          return m.id === menu.id ? {...m, picked: true} : m;
        })
      });
    };

    return (
      <MenuItem
        key={idx}
        data-menu={menu}
        primaryText={menu.label}
        onTouchTap={() => onTouchTapMenu(menu)}
        />
    );
  }

  renderSearchSimple() {
    return (
      <div>
        <TextField
          style={{width: 270}}
          value={this.props.searchWord.value}
          onChange={this.handleChange}
          hintText="簡易検索"
          floatingLabelText="簡易検索"
          />
      </div>
    );
  }

  renderSearchDetail(menu, idx) {
    const onTouchTapDelete = (menu) => {
      this.setState({
        searchItems: this.state.searchItems.map(m => {
          return m.id === menu.id ? {...m, picked: false} : m;
        })
      });
    };

    const textField = (menu) => {
      return (
        <TextField
          onChange={() => console.log("change") }
          floatingLabelText={menu.label}
          hintText={menu.label}
          />
      );
    };

    const datePicker = (menu) => {
      return (
        <DatePicker
          conChange={() => console.log("") }
          floatingLabelText={menu.label}
          hintText={menu.label}
          />
      );
    };

    const selectField = (menu) => {
      return (
        <SelectField
          floatingLabelText={menu.label}
          onChange={() => console.log("change") }
          >

          <MenuItem value={null} primaryText="" />
          <MenuItem value={false} primaryText="No" />
          <MenuItem value={true} primaryText="Yes" />
        </SelectField>
      );
    };

    let searchForm;
    if (menu.type === "string") {
      searchForm = textField;
    }

    if (menu.type === "date") {
      searchForm = datePicker;
    }

    if (menu.type === "boolean") {
      searchForm = selectField;
    }

    return (
      <div style={{display: "flex"}}>

        <IconButton
          style={{marginTop: 23}}
          onClick={() => onTouchTapDelete(menu) } >
          <ContentRemoveCircleOutline />
        </IconButton>

        {searchForm(menu)}

      </div>
    );
  }

  render() {

    return (
      <div style={{marginTop: 10, marginRight: 25, marginBottom: 15}}>

        {/* フィルタ追加ボタン */}
        <div style={styles.buttonContainer}>
          <div>
            <RaisedButton style={styles.button} label="フィルタ追加"
                          onTouchTap={this.handleTouchTap} />

            <Popover 
              open={this.state.open}
              anchorEl={this.state.anchorEl}
              anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
              targetOrigin={{horizontal: 'left', vertical: 'top'}}
              onRequestClose={this.handleRequestClose}
              >

              <Menu>
                {this.state.searchItems.map(
                  (menu, idx) => !menu.picked ? this.renderMenu(menu, idx) : null
                )}
              </Menu>
            </Popover>
          </div>
        </div>

        <div style={styles.formContainer}>
          {/* 簡易検索 */}
          {this.state.searchItems.filter(item => item.picked).length === 0
          ? this.renderSearchSimple() : null }

          {/* 詳細検索 */}
          {this.state.searchItems.map(
            (menu, idx) => menu.picked ? this.renderSearchDetail(menu, idx) : null
          )}


        </div>

      </div>
    );
  }
};

export default FileSearch;
