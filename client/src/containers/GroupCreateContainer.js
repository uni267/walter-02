import React, { Component } from "react";

// route
import { Link, withRouter } from "react-router-dom";

// store
import { connect } from "react-redux";

// material
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardText, 
  CardMedia, 
  CardActions
} from 'material-ui/Card';
import FlatButton from "material-ui/FlatButton";

// components
import NavigationContainer from "./NavigationContainer";
import GroupDetailBasic from "../components/Group/GroupDetailBasic";

// actions
import {
  changeGroupName,
  changeGroupDescription,
  createGroup
} from "../actions";

class GroupCreateContainer extends Component {
  render() {
    return (
      <div>
        <NavigationContainer />

        <Card>
          <CardTitle title="グループ作成" />
          <CardText>

            <div style={{ display: "flex" }}>
              <Card style={{ width: "35%", marginRight: 20 }}>
                <CardTitle subtitle="基本情報" />
                <CardText>
                  <GroupDetailBasic {...this.props} displaySaveButton={false} />
                </CardText>
              </Card>
            </div>

          </CardText>
          <CardActions>
            <FlatButton
              label="保存"
              primary={true}
              onTouchTap={() => {
                this.props.createGroup(this.props.changedGroup, this.props.history);
              }}
            />
            <FlatButton label="閉じる" href="/groups" />
          </CardActions>
        </Card>
        
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    group: state.group.data,
    changedGroup: state.group.changed,
    validationErrors: state.group.errors,
    tenant: state.tenant
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  changeGroupName: (name) => dispatch(changeGroupName(name)),  
  changeGroupDescription: (description) => dispatch(changeGroupDescription(description)),
  createGroup: (group, history) => dispatch(createGroup(group, history))
});

GroupCreateContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(GroupCreateContainer);

export default GroupCreateContainer;
