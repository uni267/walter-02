import React, { Component } from "react";
import PropTypes from "prop-types";

import DatePicker from 'material-ui/DatePicker';
import TextField from "material-ui/TextField";
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import IconButton from "material-ui/IconButton";
import ContentRemoveCircleOutline from "material-ui/svg-icons/content/remove-circle-outline";

import { find } from 'lodash';

class DetailSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: []
    };
  }

  componentDidUpdate(prevProps, prevState){
    if(prevProps.searchItems !== this.props.searchItems && this.state.items.length > 0){
      this.execSearch();
    }
  }

  execSearch = () => {
    const queryItems = this.state.items.reduce( (prev, cur) => {
      if( find( this.props.searchItems , { _id:cur._id } ).picked  ){
        prev[cur._id] = cur.value;
      }
      return prev;
    }, {});

    this.props.actions.searchFileDetail(this.props.history, queryItems);
  };

  appendSearchValue = (item, searchValue) => {
    const _item = { ...item, value: searchValue };
    const alreadyExists = this.state.items
          .filter(item => item._id === _item._id).length > 0;

    if (alreadyExists) {
      const _items = this.state.items.map( item => {
        if(item.between){

          if( item._id === _item._id ){
            const _value = {
              lt: ( _item.value.lt === undefined ) ? item.value.lt : _item.value.lt,
              gt: ( _item.value.gt === undefined ) ? item.value.gt : _item.value.gt
            }
            _item.value = _value;
            return _item;
          }else{
            return item;
          }

        }else{
          return item._id === _item._id ? _item : item;
        }
    });

      this.setState({ items: _items });
    }
    else {
      this.setState({ items: [...this.state.items, _item ] });
    }
  }

  searchTextField = (item) => {
      return (
      <TextField
        onKeyPress={ e => {
          if (e.key === "Enter") {
            this.execSearch();
          }
        }}
        onChange={ (e,val) => this.appendSearchValue(item, val) }
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

  searchBetweenDateField = (item) => {
    return (
      <div style={{ display:"flex" }} >
        <DatePicker
          onChange={ (e, value) => {
            new Promise( (resolve, reject) => {
              const result = this.appendSearchValue(item, { gt:value });
              resolve(result);
            }).then( res => {
              this.execSearch();
            });
          }}
          floatingLabelText={`${item.label}(より大きい)`}
          hintText={item.label}
          style={{paddingRight:48}}
          />

        <DatePicker
          onChange={ (e, value) => {
            new Promise( (resolve, reject) => {
              const result = this.appendSearchValue(item, { lt:value });
              resolve(result);
            }).then( res => {
              this.execSearch();
            });
          }}
          floatingLabelText={`${item.label}(より小さい)`}
          hintText={item.label}
          />
      </div>
    );
  };

  renderField = (item) => {
    switch (item.value_type) {
      case "Date":
        return  item.between ? this.searchBetweenDateField(item) : this.searchDateField(item);
      case "String":
      default:
        return this.searchTextField(item);
    }
  };

  renderForm = (item, idx) => {
    return (
      <div key={idx} style={{display: item.picked ? "flex" :"none" }}>
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
    return (
      <div style={{ display: "flex", flexDirection: "row-reverse", flexWrap: "wrap" }}>
        {this.props.searchItems.map( (item, idx) => this.renderForm(item) )}
      </div>
    );
  }
}

export default DetailSearch;
