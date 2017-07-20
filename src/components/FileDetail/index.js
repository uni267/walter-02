import React, { Component } from "react";

// router
import { Link } from "react-router-dom";

// material-ui
import { Card, CardHeader, CardTitle, CardText, CardMedia } from 'material-ui/Card';
import IconButton from "material-ui/IconButton";

// material icon
import HardwareKeyboardArrowLeft from "material-ui/svg-icons/hardware/keyboard-arrow-left";

// components
import History from "./History";

const styles = {
  fileImageWrapper: {
    display: "flex"
  },
  innerCard: {
    marginTop: 10,
    marginLeft: 15,
    marginRight: 15
  }
};

class FileDetail extends Component {

  renderHistories(file) {
    return file.histories.map( (history, idx) => {
      return <History key={idx} history={history} />;
    });
  }

  render() {
    const cardOverlay = (
      <CardTitle subtitle={this.props.file.name} />
    );

    const fileTitle = (
      <div style={{display: "flex", alignItems: "center"}}>
        <Link to={"/home"} style={{textDecoration: "none"}}>
          <IconButton>
            <HardwareKeyboardArrowLeft />
          </IconButton>
        </Link>
        {this.props.file.name}
      </div>
    );

    return (
      <Card style={{paddingBottom: 10}}>
        <CardHeader
          title={fileTitle} />

        <div style={styles.fileImageWrapper}>

          <Card style={{...styles.innerCard, width: "70%"}}>
            <CardMedia overlay={cardOverlay}>
              <img src="/images/baibaikihon.png" />
            </CardMedia>
          </Card>

          <Card style={{...styles.innerCard, width: "30%"}}>
            <CardText>
              {this.renderHistories(this.props.file)}
            </CardText>
          </Card>

        </div>
      </Card>
    );
  }
}

export default FileDetail;
