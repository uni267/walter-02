import React, { Component } from "react";

// store
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

// material
import {
  Card,
  CardTitle,
  CardText
} from 'material-ui/Card';

import {
  Table,
  TableBody,
  TableHeader,
  TableRow,
  TableRowColumn
} from 'material-ui/Table';

import Menu from "material-ui/Menu";
import MenuItem from "material-ui/MenuItem";
import ActionLabel from "material-ui/svg-icons/action/label";
import Divider from "material-ui/Divider";
import RaisedButton from "material-ui/RaisedButton";

// components
import NavigationContainer from "./NavigationContainer";
import TagTableHeader from "../components/Tag/TagTableHeader";
import TagTableBody from "../components/Tag/TagTableBody";

// actions
import * as TagActions from "../actions/tags";

class TagContainer extends Component {
  componentWillMount() {
    this.props.actions.requestFetchTags();
  }

  handleChangeOrderNumber = (value, index) => {
    this.props.actions.setTagsOrderNumber(value, index)
  }

  renderTags = (tags) => {
    return tags.length === 0
      ?
      (
        <TableRow>
          <TableRowColumn>一致するタグはありません</TableRowColumn>
        </TableRow>
      )
      : tags.map( (tag, idx) => <TagTableBody tag={tag} key={idx} onChangeOrderNumber={value => this.handleChangeOrderNumber(value, idx)} />);
  };

  render() {
    const headers = [
      { name: "タグ名" },
      { name: "色" },
      { name: "編集" },
      { name: "並び順" },
    ];

    return (
      <div>
        <NavigationContainer />
        <Card>
          <CardText>
            <div style={{ display: "flex" }}>
              <div style={{ width: "20%" }}>
                <CardTitle title="タグ管理" />
              </div>
            </div>

            <div style={{ display: "flex" }}>
              <div style={{ width: "80%", display: "inline-flex", flexDirection: "column" }}>
                <Table>
                  <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                    <TagTableHeader headers={headers} />
                  </TableHeader>

                  <TableBody displayRowCheckbox={false}>
                    {this.renderTags(this.props.tags)}
                  </TableBody>
                </Table>
                <RaisedButton
                  label="並び順を保存"
                  primary={true}
                  onClick={() => this.props.actions.saveTagsOrderNumber(this.props.tags)}
                  style={{alignSelf:'flex-end', marginTop:12, marginRight:12}} />
              </div>

              <div style={{ width: "20%" }}>
                <Divider />
                <Menu disableAutoFocus>
                  <MenuItem
                    primaryText="タグ作成"
                    onTouchTap={() => this.props.history.push("/tags/create")}
                    leftIcon={<ActionLabel />}
                    />
                </Menu>
              </div>
            </div>

          </CardText>
        </Card>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    tags: state.tags,
    tenant: state.tenant
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  actions: bindActionCreators(TagActions, dispatch)
});

TagContainer = connect(mapStateToProps, mapDispatchToProps)(TagContainer);

export default TagContainer;
