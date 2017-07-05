import React, { Component } from "react";

// material
import Chip from 'material-ui/Chip';

// router
import { Link } from "react-router-dom";

// store
import { connect } from "react-redux";

/* import IconButton from 'material-ui/IconButton';
 * import ArrowForwardIcon from 'material-ui/svg-icons/navigation/arrow-forward';*/

class DirBox extends Component {
  constructor(props) {
    super(props);
    this.styles = {
      chips: {
        marginTop: 30,
        marginLeft: 20,
      },

      wrapper: {
        display: 'flex',
        flexWrap: 'wrap',
      }
    };
  }

  renderDir(dir) {
    return (
      <Chip key={dir.id} style={this.styles.chips}>
        <Link to={`/?dir_id=${dir.id}`}>
          {dir.name}
        </Link>
      </Chip>
    );
  }

  render() {
    const { dir_id, files } = this.props;
    const dirs = files
          .filter(f => f.is_dir)
          .filter(d => d.id <= Number(dir_id));

    return (
      <div className="dir-box" style={this.styles.wrapper}>
        {dirs.map(dir => this.renderDir(dir))}
      </div>
    );
  }
}

export default DirBox;
