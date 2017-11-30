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

  execSearch = () => {
    const queryItems = this.state.items.reduce( (prev, cur) => {
      prev[cur._id] = cur.value;
      return prev;
    }, {});

    this.props.actions.searchFileDetail(this.props.history, queryItems);
  };

  appendSearchValue = (item, searchValue) => {
    const _item = { ...item, value: searchValue };
    const alreadyExists = this.state.items
          .filter(item => item._id === _item._id).length > 0;

    if (alreadyExists) {
      const _items = this.state.items.map( item => (
        item._id === _item._id ? _item : item
      ));

      this.setState({ items: _items });
    }
    else {
      this.setState({ items: [...this.state.items, _item ] });
    }
  }

  searchTextField = (item) => {
    let searchValue = "";

    return (
      <TextField
        ref={(input) => searchValue = input }
        onKeyPress={ e => {
          if (e.key === "Enter") {
            this.execSearch();
          }
          else {
            this.appendSearchValue(item, searchValue.getValue() );
          }
        }}
        floatingLabelText={item.label}
        hintText={item.label}
        />
    );
  };

  searchDateField = (item) => {
    return (
      <DatePicker
        onChange={ (e, value) => {
          new Promise( (resolve, reject) => {
            const result = this.appendSearchValue(item, value);
            resolve(result);
          }).then( res => {
            this.execSearch();
          });
        }}
        floatingLabelText={item.label}
        hintText={item.label}
        />
    );
  };

  renderField = (item) => {
    switch (item.value_type) {
    case "String":
      return this.searchTextField(item);
    case "Date":
      return this.searchDateField(item);
    default:
      return null;
    }
  };

  renderForm = (item, idx) => {
    return (
      <div key={idx} style={{display: "flex"}}>
        <IconButton
          style={{marginTop: 23}}
          onClick={() => this.props.actions.searchItemNotPick(item) } >
          <ContentRemoveCircleOutline />
        </IconButton>

        {this.renderField(item)}
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
