import React, { Component } from "react";

// store
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

// material ui
import { Card, CardTitle, CardText } from 'material-ui/Card';
import DatePicker from 'material-ui/DatePicker';

// components
import NavigationContainer from "./NavigationContainer";
import TotalPie from "../components/Analysis/TotalPie";
import UsagesBar from "../components/Analysis/UsagesBar";
import NoShapePie from "../components/Analysis/NoShapePie";
import ShapePie from "../components/Analysis/ShapePie";

// actions
import * as AnalysisActions from "../actions/analysises";

class MonitorContainer extends Component {
  componentWillMount() {
    this.props.actions.requestFetchAnalysis();
  }

  render() {
    const rowWidth = 1050;

    return (
      <div>
        <NavigationContainer />
        <div>
          <Card>
            <CardTitle title="容量管理" />
            <CardText>

              <div style={{ marginBottom: 20, marginLeft: 20 }}>
                <DatePicker hintText="該当日を指定" />
              </div>

              <div style={{ display: "flex" }}>
                <Card style={{ width: rowWidth / 3 }}>
                  <CardTitle subtitle="使用率"/>
                  <CardText>
                    <TotalPie { ...this.props } cardWidth={ rowWidth / 3 } />
                  </CardText>
                </Card>                                  

                <Card style={{ width: rowWidth / 3 }}>
                  <CardTitle subtitle="ファイル数" />
                  <CardText>
                    <ShapePie
                      data={this.props.fileCount}
                      pieColor="#FFBB28"
                      cardWidth={ rowWidth / 3 } />
                  </CardText>
                </Card>

                <Card style={{ width: rowWidth / 3 }}>
                  <CardTitle subtitle="フォルダ数" />
                  <CardText>
                    <ShapePie
                      data={this.props.folderCount}
                      pieColor="#00C49F"
                      cardWidth={ rowWidth / 3 } />
                  </CardText>
                </Card>
              </div>

              <div style={{ display: "flex", marginTop: 30 }}>
                <Card style={{ width: rowWidth / 2 }}>
                  <CardTitle subtitle="使用率(フォルダ毎)" />
                  <CardText>
                    <NoShapePie
                      data={this.props.folders} 
                      cardWidth={ rowWidth / 2 } />
                  </CardText>
                </Card>

                <Card style={{ width: rowWidth / 2 }}>
                  <CardTitle subtitle="使用率(ユーザ/グループ毎)" />
                  <CardText>
                    <NoShapePie
                      data={this.props.users}
                      cardWidth={ rowWidth / 2 } />
                  </CardText>
                </Card>
              </div>

              <div style={{ display: "flex", marginTop: 30 }}>
                <Card style={{ width: rowWidth / 2 }}>
                  <CardTitle subtitle="使用率(ファイル種別毎)" />
                  <CardText>
                    <NoShapePie
                      data={this.props.mimetypes}
                      cardWidth={ rowWidth / 2 } />
                  </CardText>
                </Card>

                <Card style={{ width: rowWidth / 2 }}>
                  <CardTitle subtitle="使用率(タグ毎)" />
                  <CardText>
                    <NoShapePie
                      data={this.props.tags}
                      cardWidth={ rowWidth / 2 } />
                  </CardText>
                </Card>
                
              </div>

              <Card style={{ width: 1050 }}>
                <CardTitle subtitle="使用容量推移" />
                <CardText>
                  <UsagesBar { ...this.props } />
                </CardText>
              </Card>

            </CardText>
          </Card>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    totals: state.analysis.totals,
    usages: state.analysis.usages,
    folders: state.analysis.folders,
    users: state.analysis.users,
    mimetypes: state.analysis.mimetypes,
    tags: state.analysis.tags,
    fileCount: state.analysis.fileCount,
    folderCount: state.analysis.folderCount
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  actions: bindActionCreators(AnalysisActions, dispatch)
});

MonitorContainer = connect(mapStateToProps, mapDispatchToProps)(MonitorContainer);
export default MonitorContainer;
