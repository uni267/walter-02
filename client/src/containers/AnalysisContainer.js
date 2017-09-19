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
  Line
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
    return (
      <div>
        <NavigationContainer />
        <Card>
          <CardTitle title="容量管理" />
          <CardText>
            <div>
              <BarChart width={1024} height={400} data={this.props.analysis}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5}} >

                <XAxis dataKey="name" />
                <YAxis dataKey="threshold" />
                <CartesianGrid strokeDasharray="1 1" />
                <Tooltip />
                <Legend />

                <Bar
                  barSize={45} dataKey="usage" fill="#8884d8" />

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
    analysis: state.analysis,
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
