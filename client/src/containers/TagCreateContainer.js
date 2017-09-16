import React, { Component } from "react";

// store
import { connect } from "react-redux";

// material ui
// material
import { 
  Card, 
  CardTitle, 
  CardText, 
  CardActions
} from 'material-ui/Card';
import FlatButton from "material-ui/FlatButton";

// components
import NavigationContainer from "./NavigationContainer";
import TagCreateBasic from "../components/Tag/TagCreateBasic";

// actions
import * as actions from "../actions";

class TagCreateContainer extends Component {
  componentWillMount() {
    this.props.initTag();
  }

  render() {
    return (
      <div>
        <NavigationContainer />
        <Card>
          <CardTitle title="タグ作成" />
          <CardText>
            <div style={{ display: "flex" }}>
              <Card style={{ width: "35%", marginRight: 20 }}>
                <CardTitle subtitle="基本情報" />
                <CardText>
                  <TagCreateBasic { ...this.props } />
                </CardText>
              </Card>
            </div>
          </CardText>
          <CardActions>
            <FlatButton 
              label="保存"
              primary={true}
              onTouchTap={() => this.props.createTag(this.props.changedTag)}
              />

              <FlatButton label="閉じる" href="/tags" />

          </CardActions>
        </Card>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    changedTag: state.tag.changedTag,
    validationErrors: state.tag.validationErrors
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  changeTagLabel: (value) => dispatch(actions.changeTagLabel(value)),
  changeTagColor: (value) => dispatch(actions.changeTagColor(value)),
  changeTagDescription: (value) => dispatch(actions.changeTagDescription(value)),
  saveTagLabel: (tag) => dispatch(actions.saveTagLabel(tag)),
  saveTagColor: (tag) => dispatch(actions.saveTagColor(tag)),
  saveTagDescription: (tag) => dispatch(actions.saveTagDescription(tag)),
  createTag: (tag) => dispatch(actions.createTag(tag, ownProps.history)),
  initTag: (tag) => dispatch(actions.initTag(tag))
});

TagCreateContainer = connect(mapStateToProps, mapDispatchToProps)(TagCreateContainer);

export default TagCreateContainer;
