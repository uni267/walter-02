import React, { Component } from "react";
import Chip from 'material-ui/Chip';
import { Link } from "react-router-dom";
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
    }
  }

  renderDir(dir) {
    return (
      <Chip
        key={dir.id}
        style={this.styles.chips}
        onTouchTap={() => console.log(`${dir.id}`)}
      >
        <Link to={`/?dir_id=${dir.id}`}>
          {dir.name}
        </Link>
      </Chip>
    );
  }

  render() {
    return (
      <div className="dir-box" style={this.styles.wrapper}>
        {this.props.dirs.map(dir => this.renderDir(dir))}
      </div>
    );
  }
}

export default DirBox;
