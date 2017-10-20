import React, { Component } from "react";

// store
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

// material ui
import { Card, CardTitle, CardText } from 'material-ui/Card';

// components
import NavigationContainer from "./NavigationContainer";
import FoldersPie from "../components/Analysis/FoldersPie";
import MimetypesPie from "../components/Analysis/MimetypesPie";
import TagsPie from "../components/Analysis/TagsPie";
import TotalPie from "../components/Analysis/TotalPie";
import UsagesBar from "../components/Analysis/UsagesBar";
import UsersPie from "../components/Analysis/UsersPie";

// actions
import * as AnalysisActions from "../actions/analysises";

const styles = {
  pie: { width: 1024, height: 250 }
};

class MonitorContainer extends Component {
  componentWillMount() {
    this.props.actions.requestFetchAnalysis(this.props.tenant.tenant_id);
  }

  render() {
    return (
      <div>
        <NavigationContainer />
        <div>
          <Card>
            <CardTitle title="容量管理" />
            <CardText>
              <Card style={{ width: 1100 }}>
                <CardTitle subtitle="全体の使用率"/>
                <CardText>
                  <TotalPie { ...this.props } styles={styles} />
                </CardText>
              </Card>                                  

              <Card style={{ width: 1100 }}>
                <CardTitle subtitle="使用容量推移" />
                <CardText>
                  <UsagesBar { ...this.props } styles={styles} />
                </CardText>
              </Card>

              <Card style={{ width: 1100 }}>
                <CardTitle subtitle="使用率(フォルダ毎)" />
                <CardText>
                  <FoldersPie { ...this.props } styles={styles} />
                </CardText>
              </Card>

              <Card style={{ width: 1100 }}>
                <CardTitle subtitle="使用率(ユーザ/グループ毎)" />
                <CardText>
                  <UsersPie { ...this.props } styles={styles} />
                </CardText>
              </Card>

              <Card style={{ width: 1100 }}>
                <CardTitle subtitle="使用率(ファイル種別毎)" />
                <CardText>
                  <MimetypesPie { ...this.props } styles={styles} />
                </CardText>
              </Card>

              <Card style={{ width: 1100 }}>
                <CardTitle subtitle="使用率(タグ毎)" />
                <CardText>
                  <TagsPie { ...this.props } styles={styles} />
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
    usage: state.analysis.usage,
    fileCount: state.analysis.file_count,
    folders: state.analysis.folders,
    users: state.analysis.users,
    mimetypes: state.analysis.mimetypes,
    tags: state.analysis.tags,
    tenant: state.tenant
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  actions: bindActionCreators(AnalysisActions, dispatch)
});

MonitorContainer = connect(mapStateToProps, mapDispatchToProps)(MonitorContainer);
export default MonitorContainer;
