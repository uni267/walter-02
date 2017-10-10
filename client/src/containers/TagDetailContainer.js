import React, { Component } from "react";

// store
import { connect } from "react-redux";

// material
import { Card, CardTitle, CardText, CardActions } from "material-ui/Card";
import FlatButton from "material-ui/FlatButton";

// components
import NavigationContainer from "./NavigationContainer";
import TitleWithGoBack from "../components/Common/TitleWithGoBack";
import TagDetailBasic from "../components/Tag/TagDetailBasic";

// actions
import * as actions from "../actions";

class TagDetailContainer extends Component {
  componentWillMount() {
    this.props.requestFetchTag(this.props.match.params.id);
  }

  componentWillUnmount() {
    this.props.initTag();
  }

  render() {
    return (
      <div>
      <NavigationContainer />
      <Card>
        <CardTitle title={<TitleWithGoBack title="タグ詳細" />} />
        <CardText>
          <div style={{ display: "flex" }}>
            <Card style={{ width: "35%" }}>
              <CardTitle subtitle="基本情報" />
              <CardText>
                <TagDetailBasic {...this.props} />
              </CardText>
            </Card>
          </div>
        </CardText>
        <CardActions>
          <FlatButton
            label="閉じる"
            primary={true}
            onTouchTap={() => this.props.history.push("/tags")} />
          <FlatButton
            label="削除"
            secondary={true}
            onTouchTap={() => this.props.deleteTag(this.props.tag._id)}
            />
        </CardActions>
      </Card>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    tag: state.tag.data,
    changedTag: state.tag.changedTag,
    validationErrors: state.tag.validationErrors
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  requestFetchTag: (tag_id) => dispatch(actions.requestFetchTag(tag_id)),
  changeTagLabel: (value) => dispatch(actions.changeTagLabel(value)),
  changeTagColor: (value) => dispatch(actions.changeTagColor(value)),
  saveTagLabel: (tag) => dispatch(actions.saveTagLabel(tag)),
  saveTagColor: (tag) => dispatch(actions.saveTagColor(tag)),
  deleteTag: (tag_id) => dispatch(actions.deleteTag(tag_id, ownProps.history)),
  initTag: () => dispatch(actions.initTag())
});

TagDetailContainer = connect(mapStateToProps, mapDispatchToProps)(TagDetailContainer);

export default TagDetailContainer;
