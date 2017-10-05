import React, { Component } from "react";

import { connect } from "react-redux";

// material ui
import FlatButton from "material-ui/FlatButton";
import AutoComplete from "material-ui/AutoComplete";
import MenuItem from "material-ui/MenuItem";
import { Card, CardTitle, CardText, CardActions } from "material-ui/Card";

// components
import NavigationContainer from "./NavigationContainer";
import MetaInfoDetailBasic from "../components/MetaInfo/MetaInfoDetailBasic";
import TitleWithGoBack from "../components/Common/TitleWithGoBack";

import * as actions from "../actions";

class MetaInfoDetailContainer extends Component {
  componentWillMount() {
    this.props.requestFetchMetaInfo(this.props.match.params.id);
  }

  componentWillUnmount() {
    this.props.initChangedMetaInfo();
  }

  render() {
    const title = `${this.props.metaInfo.key}の詳細`;

    return (
      <div>
        <NavigationContainer />

        <Card>
          <CardTitle title={<TitleWithGoBack title={title} />}/>
          <CardText>

            <div style={{ display: "flex" }}>
              <Card style={{ width: "35%", marginRight: 20 }}>
                <CardTitle subtitle="基本情報" />
                <CardText>
                  <MetaInfoDetailBasic {...this.props} />
                </CardText>
              </Card>
            </div>

          </CardText>
          <CardActions>
            <FlatButton
              label="閉じる"
              primary={true}
              onTouchTap={() => this.props.history.push("/meta_infos")} />
          </CardActions>
        </Card>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    metaInfo: state.metaInfo.metaInfo,
    changedMetaInfo: state.metaInfo.changedMetaInfo,
    validationErrors: state.metaInfo.validationErrors,
    valueTypes: state.metaInfo.valueTypes
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  requestFetchMetaInfo: (meta_id) => (
    dispatch(actions.requestFetchMetaInfo(meta_id))
  ),
  changeMetaInfoKey: (key) => (
    dispatch(actions.changeMetaInfoKey(key))
  ),
  changeMetaInfoValueType: (value_type) => (
    dispatch(actions.changeMetaInfoValueType(value_type))
  ),
  initChangedMetaInfo: () => dispatch(actions.initChangedMetaInfo())
});

MetaInfoDetailContainer = connect(
  mapStateToProps, mapDispatchToProps
)(MetaInfoDetailContainer);

export default MetaInfoDetailContainer;
