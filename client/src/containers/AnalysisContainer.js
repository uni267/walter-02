import React, { Component } from "react";

// store
import { connect } from "react-redux";

// recharts
import { 
  BarChart,
  Bar,
  XAxis, 
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Line,
  PieChart,
  Pie,
  Sector,
  Cell
} from "recharts";

// material ui
import { 
  Card, 
  CardTitle, 
  CardText
} from 'material-ui/Card';

// components
import NavigationContainer from "./NavigationContainer";

// actions
import * as actions from "../actions";

class MonitorContainer extends Component {
  componentWillMount() {
    this.props.requestFetchAnalysis(this.props.tenant.tenant_id);
  }

  render() {
    const colors = [
      "#d2584c", // 使用中
      "#00bcd4"  // 空き
    ];

    return (
      <div>
        <NavigationContainer />
        <Card>
          <CardTitle title="容量管理" />
          <CardText>
            <div>
              <CardTitle subtitle="使用率"/>
              <PieChart width={700} height={300}>
                <Pie
                  data={this.props.rate}
                  innerRadius={30}
                  outerRadius={150}
                  fill="#8884d8"
                  paddingAngle={2}
                  label >
                  {colors.map( (color, idx) => <Cell fill={color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </div>

            <div>
              <CardTitle subtitle="使用容量推移" />

              <BarChart width={1024} height={300} data={this.props.usage}
                        margin={{ top: 5, right: 30, left: 10, bottom: 5}} >

                <XAxis dataKey="name" />
                <YAxis dataKey="threshold" />
                <CartesianGrid strokeDasharray="1 1" />
                <Tooltip />
                <Legend />

                <Bar
                  barSize={45} dataKey="usage" fill="#8884d8" />

              </BarChart>
            </div>

            <div>
              <CardTitle subtitle="ファイル数推移" />
              <BarChart width={1024} height={300} data={this.props.fileCount}
                        margin={{ top: 5, right: 30, left: 10, bottom: 5}} >

                <XAxis dataKey="name" />
                <YAxis />
                <CartesianGrid strokeDasharray="1 1" />
                <Tooltip />
                <Legend />

                <Bar
                  barSize={45} dataKey="file_count" fill="#82ca9d" />

              </BarChart>
            </div>

          </CardText>
        </Card>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    rate: state.analysis.rate,
    usage: state.analysis.usage,
    fileCount: state.analysis.file_count,
    tenant: state.tenant
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  requestFetchAnalysis: (tenant_id) => {
    dispatch(actions.requestFetchAnalysis(tenant_id));
  }
});

MonitorContainer = connect(mapStateToProps, mapDispatchToProps)(MonitorContainer);
export default MonitorContainer;
