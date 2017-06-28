import React, { Component } from "react";
import { Step, Stepper, StepLabel } from 'material-ui/Stepper';
import ArrowForwardIcon from 'material-ui/svg-icons/navigation/arrow-forward';

class DirBox extends Component {
  display_dir(dir) {
    return (
      <Step key={dir.id}>
        <StepLabel>{dir.name}</StepLabel>
      </Step>
    );
  }

  render() {
    return (
      <div style={{width: '100%', maxWidth: 200}} className="dir-box">
        <Stepper connector={<ArrowForwardIcon />}>
          {this.props.dirs.map(dir => this.display_dir(dir))}
        </Stepper>
      </div>
    );
  }
}

export default DirBox;
