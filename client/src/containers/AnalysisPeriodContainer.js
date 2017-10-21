import React, { Component } from "react";

// store
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

// material ui
import { Card, CardTitle, CardText } from "material-ui/Card";
import DatePicker from "material-ui/DatePicker";
import Menu from "material-ui/Menu";
import MenuItem from "material-ui/MenuItem";
import Divider from "material-ui/Divider";

// components
import NavigationContainer from "./NavigationContainer";
import UsagesArea from "../components/Analysis/UsagesArea";

import * as AnalysisActions from "../actions/analysises";

class AnalysisPeriodContainer extends Component {
  componentWillMount() {
    this.props.actions.requestFetchAnalysis();
  }

  render() {
    const cardWidth = 1070;

    return (
      <div>
        <NavigationContainer />
        <Card>
          <CardTitle title="容量管理" />
          <CardText>

            <div style={{ display: "flex", marginBottom: 20, marginLeft: 20 }}>
              <div>
                <DatePicker hintText="開始年月日" />
              </div>
              <div style={{ marginLeft: 20 }}>
                <DatePicker hintText="終了年月日" />
              </div>
            </div>

            <div style={{ display: "flex" }}>
              <div>
                <Card style={{ width: cardWidth }}>
                  <CardTitle subtitle="使用容量推移" />
                  <CardText>
                    <UsagesArea { ...this.props } cardWidth={cardWidth} />
                  </CardText>
                </Card>
              </div>

              <div style={{ marginLeft: 30, width: 180 }}>
                <Divider />
                <Menu>
                  <MenuItem primaryText="サマリー"
                            onTouchTap={() => this.props.history.push("/analysis")} />
                    <MenuItem primaryText="使用容量推移" />
                </Menu>
                <Divider />
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
    usages: state.analysis.usages
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  actions: bindActionCreators(AnalysisActions, dispatch)
});

AnalysisPeriodContainer = connect(
  mapStateToProps, mapDispatchToProps
)(AnalysisPeriodContainer);

export default AnalysisPeriodContainer;
