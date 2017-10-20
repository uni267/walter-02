import React, { Component } from "react";

// store
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

// material ui
import { Card, CardTitle, CardText } from 'material-ui/Card';
import DatePicker from 'material-ui/DatePicker';

// components
import NavigationContainer from "./NavigationContainer";
import FoldersPie from "../components/Analysis/FoldersPie";
import MimetypesPie from "../components/Analysis/MimetypesPie";
import TagsPie from "../components/Analysis/TagsPie";
import TotalPie from "../components/Analysis/TotalPie";
import UsagesBar from "../components/Analysis/UsagesBar";
import UsersPie from "../components/Analysis/UsersPie";
import FileCountPie from "../components/Analysis/FileCountPie";
import FolderCountPie from "../components/Analysis/FolderCountPie";

// actions
import * as AnalysisActions from "../actions/analysises";

class MonitorContainer extends Component {
  componentWillMount() {
    this.props.actions.requestFetchAnalysis();
  }

  render() {
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
                <Card style={{ width: 350 }}>
                  <CardTitle subtitle="使用率"/>
                  <CardText>
                    <TotalPie { ...this.props } />
                  </CardText>
                </Card>                                  

                <Card style={{ width: 350 }}>
                  <CardTitle subtitle="ファイル数" />
                  <CardText>
                    <FileCountPie { ...this.props } />
                  </CardText>
                </Card>

                <Card style={{ width: 350 }}>
                  <CardTitle subtitle="フォルダ数" />
                  <CardText>
                    <FolderCountPie { ...this.props }/>
                  </CardText>
                </Card>
              </div>

              <div style={{ display: "flex", marginTop: 20 }}>
                <Card style={{ width: 525 }}>
                  <CardTitle subtitle="使用率(フォルダ毎)" />
                  <CardText>
                    <FoldersPie { ...this.props } />
                  </CardText>
                </Card>

                <Card style={{ width: 525 }}>
                  <CardTitle subtitle="使用率(ユーザ/グループ毎)" />
                  <CardText>
                    <UsersPie { ...this.props } />
                  </CardText>
                </Card>
              </div>

              <div style={{ display: "flex", marginTop: 20 }}>
                <Card style={{ width: 525 }}>
                  <CardTitle subtitle="使用率(ファイル種別毎)" />
                  <CardText>
                    <MimetypesPie { ...this.props } />
                  </CardText>
                </Card>

                <Card style={{ width: 525 }}>
                  <CardTitle subtitle="使用率(タグ毎)" />
                  <CardText>
                    <TagsPie { ...this.props } />
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
