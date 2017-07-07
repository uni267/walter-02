import React, { Component } from "react";

// router
import { Link } from "react-router-dom";

class DirBox extends Component {
  constructor(props) {
    super(props);
    this.styles = {
      wrapper: {
        display: 'flex',
        flexWrap: 'wrap',
        marginTop: 10,
        marginLeft: 20
      },
      dir_list: {
        marginTop: 10,
        marginLeft: 10,
        padding: 10
      },
      dir: {
        color: "#555",
        fontSize: 18,
        textDecoration: "none"
      }
    };
  }

  renderDir(dir) {
    return (
      <div key={dir.id} style={this.styles.dir_list}>
        <Link to={`/?dir_id=${dir.id}`} style={this.styles.dir}>
          {dir.name}
        </Link>
      </div>
    );
  }

  render() {
    return (
      <div className="dir-box" style={this.styles.wrapper}>
        {this.props.dirs.map((dir, idx) => this.renderDir(dir, idx))}
      </div>
    );
  }
}

export default DirBox;
