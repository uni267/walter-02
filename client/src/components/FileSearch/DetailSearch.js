import React, { Component } from "react";
import PropTypes from "prop-types";

import DatePicker from 'material-ui/DatePicker';
import TextField from "material-ui/TextField";
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import IconButton from "material-ui/IconButton";
import ContentRemoveCircleOutline from "material-ui/svg-icons/content/remove-circle-outline";

class DetailSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: []
    };
  }
  
  handleKeyPress = (event, item, searchValue) => {
    if (event.key === "Enter") {

      const queryItems = this.state.items.reduce( (pre, cur) => {
        pre[cur._id] = cur.value;
        return pre;
      }, {});

      this.props.actions.searchFileDetail(this.props.history, queryItems);

    }
    else {
      const _item = { ...item, value: searchValue.getValue() };
      const alreadyExists = this.state.items
            .filter(item => item._id === _item._id).length > 0;

      if (alreadyExists) {
        const _items = this.state.items.map( item => {
          return item._id === _item._id ? _item : item;
        });
        this.setState({ items: _items });
      }
      else {
        this.setState({ items: [...this.state.items, _item ]});
      }
    }
  };

  searchField = (item) => {
    let searchValue = "";

    return (
      <TextField
        ref={(input) => searchValue = input}
        onKeyPress={ e => this.handleKeyPress(e, item, searchValue) }
        floatingLabelText={item.label}
        hintText={item.label}
        />
    );
  };

  renderForm = (item, idx) => {
    return (
      <div key={idx} style={{display: "flex"}}>
        <IconButton
          style={{marginTop: 23}}
          onClick={() => this.props.actions.searchItemNotPick(item) } >
          <ContentRemoveCircleOutline />
        </IconButton>

        {this.searchField(item)}
      </div>
    );
  }

  render() {
    const items = this.props.searchItems.filter(item => item.picked);
    return (
      <div style={{ display: "flex", flexDirection: "row-reverse", flexWrap: "wrap" }}>
        {items.map( (item, idx) => this.renderForm(item) )}
      </div>
    );
  }
}

export default DetailSearch;
