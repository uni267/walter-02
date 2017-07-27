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
  dirRoute = (dir) => {
    let result = [];

    const walk = (dir) => {
      if (Number(dir.id) === 0) {
        result = [{ id: 0 }];
        return;
      }

      const dirs = this.props.dirs.slice();
      const target = dirs
            .filter(d => d.descendant === Number(dir.id) && d.depth === 1)[0];

      // top node
      if (target.ancestor === 0) {
        result = [{ id: target.descendant }, ...result];
        result = [{ id: target.ancestor }, ...result];
        return;
      } else {
        result = [{ id: target.descendant }, ...result];
        walk({ id: target.ancestor });
      }

    };

    walk(dir);
    return result;
    
  };

  addDirName = (dir) => {
    return this.props.allFiles.filter(file => dir.id == file.id)[0];
  };

  renderDir = (dir, idx) => {
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
    const _dirs = this.dirRoute({ id: this.props.dirId })
          .map(this.addDirName);

    const dirs = [].concat.apply([], _dirs.map( (dir, idx) => {
      return (idx === 0) ? dir : ["sep", dir];
    }));

    return (
      <div className="dir-box" style={styles.wrapper}>
        {dirs.map((dir, idx) => this.renderDir(dir, idx))}
      </div>
    );
  }
}

DirBox.propTypes = {
  dirs: PropTypes.array,
  dirId: PropTypes.number,
  allFiles: PropTypes.array
};

export default DirBox;

