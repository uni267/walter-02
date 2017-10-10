import React, { Component } from "react";

// store
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

import Divider from "material-ui/Divider";
import Menu from "material-ui/Menu";
import MenuItem from "material-ui/MenuItem";
import ActionLabel from "material-ui/svg-icons/action/label";

// components
import NavigationContainer from "./NavigationContainer";
import TagTableHeader from "../components/Tag/TagTableHeader";
import TagTableBody from "../components/Tag/TagTableBody";
import SimpleSearch from "../components/FileSearch/SimpleSearch";

// actions
import * as actions from "../actions";

class TagContainer extends Component {
  componentWillMount() {
    this.props.requestFetchTags();
  }

  renderTags = (tags) => {
    return tags.length === 0
      ?
      (
        <TableRow>
          <TableRowColumn>一致するタグはありません</TableRowColumn>
        </TableRow>
      )
      : tags.map( (tag, idx) => <TagTableBody tag={tag} key={idx} />);
  };

  render() {
    const headers = [
      { name: "タグ名" },
      { name: "色" },
      { name: "編集" }
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

              <div style={{ width: "80%" }}>
                <div style={{ display: "flex", flexDirection: "row-reverse" }}>
                  <SimpleSearch
                    searchFileSimple={ keyword => {
                      this.props.searchTagSimple(keyword);
                    }}
                    hintText="タグ名を入力"
                  />
                </div>
              </div>
            </div>

            <div style={{ display: "flex" }}>
              <div style={{ width: "80%" }}>
                <Table>
                  <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                    <TagTableHeader headers={headers} />
                  </TableHeader>

                  <TableBody displayRowCheckbox={false}>
                    {this.renderTags(this.props.tags)}
                  </TableBody>
                </Table>
              </div>

              <div style={{ width: "20%" }}>
                <Menu>
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
  requestFetchTags: () => dispatch(actions.requestFetchTags()),
  searchTagSimple: (keyword) => dispatch(actions.searchTagSimple(keyword))
});

TagContainer = connect(mapStateToProps, mapDispatchToProps)(TagContainer);

export default TagContainer;
