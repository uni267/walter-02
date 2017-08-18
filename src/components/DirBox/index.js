import React, { Component } from "react";
import PropTypes from "prop-types";

// router
import { Link } from "react-router-dom";

const styles = {
  wrapper: {
    display: 'flex',
    flexWrap: 'wrap',
    marginTop: 30,
    marginLeft: 20
  },
  dir_list: {
    marginTop: 10,
    marginLeft: 10,
    padding: 5
  },
  dir: {
    color: "#555",
    fontSize: 18,
    textDecoration: "none"
  }
};

class DirBox extends Component {
  renderDir = (dir, idx) => {
    if (dir === "sep") {
      return (
        <div key={idx} style={styles.dir_list}>&gt;</div>
      );
    } else {
      return (
        <div key={idx} style={styles.dir_list}>
          <Link to={`/home?dir_id=${dir._id}`} style={styles.dir}>
            {dir.name}
          </Link>
        </div>
      );
    }
  }

  render() {
    return (
      <div className="dir-box" style={styles.wrapper}>
        {this.props.dirs.map((dir, idx) => this.renderDir(dir, idx))}
      </div>
    );
  }
}

DirBox.propTypes = {
  dirs: PropTypes.array.isRequired,
  dirId: PropTypes.string.isRequired
};

export default DirBox;

