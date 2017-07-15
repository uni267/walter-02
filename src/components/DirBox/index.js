import React, { Component } from "react";

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
  renderDir(dir, idx) {
    if (dir === "sep") {
      return (
        <div key={idx} style={styles.dir_list}>&gt;</div>
      );
    } else {
      return (
        <div key={idx} style={styles.dir_list}>
          <Link to={`/home?dir_id=${dir.id}`} style={styles.dir}>
            {dir.name}
          </Link>
        </div>
      );
    }
  }

  render() {
    let dirs = [].concat.apply([], this.props.dirs.map( (dir, idx) => {
      return (idx === 0) ? dir : ["sep", dir];
    }));


    return (
      <div className="dir-box" style={styles.wrapper}>
        {dirs.map((dir, idx) => this.renderDir(dir, idx))}
      </div>
    );
  }
}

export default DirBox;

