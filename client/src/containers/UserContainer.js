import React, { Component } from "react";

// store
import { connect } from "react-redux";

// route
import { Link } from "react-router-dom";

// material
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardText, 
  CardMedia, 
  CardActions
} from 'material-ui/Card';

import {
  Table,
  TableBody,
  TableFooter,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';

import Chip from 'material-ui/Chip';
import IconButton from 'material-ui/IconButton';
import ActionHome from 'material-ui/svg-icons/action/home';
import ImageEdit from "material-ui/svg-icons/image/edit";

// components
import NavigationContainer from "./NavigationContainer";
import AddFilterBtn from "../components/FileSearch/AddFilterBtn";
import SimpleSearch from "../components/FileSearch/SimpleSearch";
import DetailSearch from "../components/FileSearch/DetailSearch";

// actions
import {
  requestFetchUsers,
  searchUsersSimple
} from "../actions";

const UserTableHeader = ({
  headers
}) => {
  return (
    <TableRow>
      {headers.map( (header, idx) => {
        return <TableHeaderColumn key={idx}>{header.name}</TableHeaderColumn>;
      })}
    </TableRow>
  );
};

const UserTableBody = ({
  user, idx
}) => {
  const renderGroups = (groups) => {
    return groups.map( (group, idx)  => (
      <Chip key={idx} style={{ marginRight: 10 }}>
        {group.name}
      </Chip>
    ));
  };

  return (
    <TableRow key={idx}>
      <TableRowColumn>
        {user.enabled ? "有効" : "無効"}
      </TableRowColumn>
      <TableRowColumn>
        {user.name}
      </TableRowColumn>
      <TableRowColumn>
        {user.email}
      </TableRowColumn>
      <TableRowColumn>
        <div style={{ display: "flex" }}>
          {renderGroups(user.groups)}
        </div>
      </TableRowColumn>
      <TableRowColumn>
        <IconButton containerElement={<Link to={`/users/${user._id}`} />}>
          <ImageEdit />
        </IconButton>
      </TableRowColumn>
    </TableRow>
  );
};

class UserContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      anchorEl: {},
      searchItems: []
    };
  }

  componentWillMount() {
    this.props.requestFetchUsers(this.props.tenant.tenant_id);
  }

  handleOpen = (e) => {
    this.setState({
      open: true,
      anchorEl: e.currentTarget
    });
  };

  handleClose = () => {
    this.setState({
      open: false
    });
  };

  handleMenuTouchTap = (menu) => {
    this.setState({
      searchItems: this.state.searchItems.map( item => {
        return item.id === menu.id ? { ...item, picked: true } : item;
      })
    });
  };

  handleDelete = (menu) => {
    this.setState({
      searchItems: this.state.searchItems.map( _menu => {
        return _menu.id === menu.id ? { ..._menu, picked: false } : _menu;
      })
    });
  };

  searchUsersSimple = (keyword) => {
    this.props.searchUsersSimple(this.props.tenant.tenant_id, keyword);
  };

  render() {
    const headers = [
      { name: "有効/無効" },
      { name: "表示名" },
      { name: "メールアドレス" },
      { name: "所属グループ" },
      { name: "編集" }
    ];

    const isSimple = this.state.searchItems.filter( item => item.picked ).length === 0;

    return (
      <div>
        <NavigationContainer />
        <Card>
          <CardText>
            <div style={{display: "flex"}}>

              <div style={{width: "20%"}}>
                <CardTitle title="ユーザ管理" />
              </div>

              <div style={{width: "80%"}}>
                <div style={{display: "flex", flexDirection: "row-reverse"}}>
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

                <div style={{display: "flex", flexDirection: "row-reverse"}}>
                  { isSimple
                    ? <SimpleSearch searchFileSimple={this.searchUsersSimple} />
                    : null }
                    
                    {this.state.searchItems.map( (menu, idx) => {
                      return menu.picked
                        ? <DetailSearch
                              menu={menu}
                              key={idx} 
                              handleDelete={this.handleDelete} />
                        : null;
                    })}
                </div>
              </div>
            </div>
            <div>
              <Table>
                <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                  <UserTableHeader headers={headers} />
                </TableHeader>
                <TableBody displayRowCheckbox={false}>
                  {this.props.users.map( (user, idx) => {
                    return <UserTableBody user={user} key={idx} />;
                  })}
                </TableBody>
              </Table>
            </div>
          </CardText>
        </Card>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    users: state.users,
    tenant: state.tenant
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  requestFetchUsers: (tenant_id) => dispatch(requestFetchUsers(tenant_id)),
  searchUsersSimple: (tenant_id, keyword) => {
    dispatch(searchUsersSimple(tenant_id, keyword));
  }
});

UserContainer = connect(mapStateToProps, mapDispatchToProps)(UserContainer);

export default UserContainer;
