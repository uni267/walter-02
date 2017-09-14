import React, { Component } from "react";

// store
import { connect } from "react-redux";

// router
import { Link } from "react-router-dom";

// material
import { 
  Card, 
  CardTitle, 
  CardText
} from 'material-ui/Card';

import { Table, TableBody, TableHeader } from 'material-ui/Table';
import Divider from "material-ui/Divider";
import Menu from "material-ui/Menu";
import MenuItem from "material-ui/MenuItem";

// components
import NavigationContainer from "./NavigationContainer";
import TagTableHeader from "../components/Tag/TagTableHeader";
import TagTableBody from "../components/Tag/TagTableBody";

// actions
import * as actions from "../actions";

class TagContainer extends Component {
  componentWillMount() {
    this.props.requestFetchTags();
  }

  render() {
    const headers = [
      { name: "タグ名" },
      { name: "色" },
      { name: "備考" },
      { name: "編集" }
    ];

    return (
      <div>
        <NavigationContainer />
        <Card>
          <CardTitle title="タグ管理" />
          <CardText>
            <div style={{ display: "flex" }}>

              <div style={{ width: "80%" }}>
                <Table>
                  <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                    <TagTableHeader headers={headers} />
                  </TableHeader>

                  <TableBody displayRowCheckbox={false}>
                    {this.props.tags.map( (tag, idx) => {
                      return <TagTableBody tag={tag} key={idx} />;
                    })}
                  </TableBody>
                </Table>
              </div>

              <div style={{ width: "20%" }}>
                <Divider />
                <Menu>
                  <MenuItem
                    primaryText="タグ作成"
                    onTouchTap={() => this.props.history.push("/tags/create")}
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
  requestFetchTags: () => dispatch(actions.requestFetchTags())
});

TagContainer = connect(mapStateToProps, mapDispatchToProps)(TagContainer);

export default TagContainer;
