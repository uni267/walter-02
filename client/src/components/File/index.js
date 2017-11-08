import React, { Component } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import { uniq } from "lodash";

// material
import Checkbox from 'material-ui/Checkbox';
import TextField from "material-ui/TextField";

// mateirla-icon
import ActionFavorite from 'material-ui/svg-icons/action/favorite';
import ActionFavoriteBorder from 'material-ui/svg-icons/action/favorite-border';

// components
import FileDialogMenu from "./FileDialogMenu";

import * as constants from "../../constants";

const style = {
  checkbox: {
    display: "flex",
    margin: 0,
    padding: 0
  },

  fileDetail: {
    textDecoration: "none",
    color: "#111"
  }
};

class File extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hover: false,
      editFile: {
        open: false
      }
    };
  }

  renderCell = (header, file, cellStyle, idx) => {
    let body;

    if (header.meta_info_id === null) {
      if (header.name === "authorities") {
        body = this.renderMember();
      } else {
        body = file[header.name];
      }
    } else {
      const meta = file.meta_infos.filter( meta => (
        meta._id === header.meta_info_id
      ));

      if (meta.length === 0) {
        body = "未定義";
      } else {
        body = meta[0].value;
      }
    }

    const color = this.state.hover ? "rgb(0, 188, 212)" : "inherit";

    const linkToFileDetail = () => {
      this.props.history.push(`/files/${this.props.file._id}`);
    };

    let element;

    if (this.props.file.dir_route === undefined) {
      element = (
        <div
          key={idx}
          onClick={linkToFileDetail}
          style={{ ...cellStyle, width: header.width, color }}>
          {body}
        </div>
      );
    } else {
      element = (
        <div key={idx} style={{ ...cellStyle, width: header.width, color }}>
          <div>
            <div onClick={linkToFileDetail}>
              {body}
            </div>
            <div style={{ fontSize: 12, color: "#aaa"}}
                 onClick={() => (
                   this.props.history.push(`/home/${this.props.file.dir_id}`)
              )}>
              場所:
              {this.props.file.dir_route === ""
              ? constants.TOP_DIR_NAME : this.rpops.file.dir_route }

            </div>
          </div>
        </div>
      );
    }

    return element;
  };

  renderFileName = () => {
    const color = this.state.hover ? "rgb(0, 188, 212)" : "inherit";

    const changeFileName = () => {

      const fileName = this.refs.fileName.getValue();

      if ( fileName === "" ) {
        this.setState({ editFile: { open: false } });
        return;
      }

      this.props.actions.editFileByIndex({ ...this.props.file, name: fileName });
      this.setState({ editFile: { open: false } });
    };

    const fileInput = (
      <div style={{...this.props.cellStyle, width: this.props.headers[1].width}}>
        
        <TextField
          id={this.props.file._id}
          ref="fileName"
          defaultValue={this.props.file.name}
          onKeyDown={e => e.key === "Enter" ? changeFileName() : null} />

      </div>
    );

    const linkToFileDetail = () => {
      this.props.history.push(`/files/${this.props.file._id}`);
    };

    const linkToDir = () => {
      this.props.history.push(`/home/${this.props.file.dir_id}`);
    };

    const style = {
      ...this.props.cellStyle,
      width: this.props.headers[1].width, color
    };

    let fileView;

    if (this.props.file.dir_route !== undefined) {
      const dir_route = this.props.file.dir_route === ""
            ? constants.TOP_DIR_NAME : this.props.file.dir_route;

      fileView = (
        <div style={style}>
          <div>
            <div onClick={linkToFileDetail}>
              {this.props.file.name}
            </div>
            <div style={{ fontSize: 12, color: "#aaa"}} onClick={linkToDir}>
              場所: {dir_route}
            </div>
          </div>
        </div>
      );
    }
    else {
      fileView = (
        <div
          style={style}
          onClick={linkToFileDetail}>
          {this.props.file.name}
        </div>
      );
    }

    return this.state.editFile.open ? fileInput : fileView;
  };

  renderMember = () => {
    const { authorities } = this.props.file;

    const member = authorities.length > 1
          ? `${uniq(authorities.map( auth => auth.users._id )).length} 人のメンバー`
          : `${authorities[0].users.name} のみ`;

    return (
      <span>
        {member}
      </span>
    );
  };

  render() {
    const { isDragging, connectDragSource, file } = this.props;
    const { rowStyle, cellStyle, headers } = this.props;

    const opacity = isDragging ? 0.3 : 1;

    const backgroundColor = file.checked ? "rgb(232, 232, 232)" : "inherit";

    const checkOpacity = this.state.hover || file.checked ? 1 : 0.1;

    const elements = (
      <div
        onMouseEnter={() => this.setState({ hover: true })}
        onMouseLeave={() => this.setState({ hover: false })}
        style={{ ...rowStyle, opacity, backgroundColor }}>

        <div style={{ ...cellStyle, width: headers[0].width }}>
          <Checkbox
            checked={file.checked}
            style={{ ...style.checkbox, opacity: checkOpacity }}
            onCheck={() => {
              this.props.setYOffset(window.pageYOffset);
              this.props.actions.toggleFileCheck(file);
            }} />

          <Checkbox
            style={style.checkbox}
            checkedIcon={<ActionFavorite />}
            uncheckedIcon={<ActionFavoriteBorder />}
            checked={file.is_star}
            onCheck={() => this.props.actions.toggleStar(file)} />
        </div>

        {headers.filter( header => (
          !["file_checkbox", "action"].includes(header.name)
          )).map( (header, idx) => (
          this.renderCell(header, file, cellStyle, idx)
        ))}

        <div style={{ ...cellStyle, width: headers[4].width }}>

          <FileDialogMenu
            actions={this.props.actions}
            file={this.props.file}
            hover={this.state.hover}
            trashDirId={this.props.tenant.trashDirId} />

        </div>

      </div>
    );

    return isDragging && connectDragSource
      ? connectDragSource(elements)
      : elements;
  }
}

File.propTypes = {
  history: PropTypes.object.isRequired,
  dir_id: PropTypes.string.isRequired,
  rowStyle: PropTypes.object.isRequired,
  cellStyle: PropTypes.object.isRequired,
  headers: PropTypes.array.isRequired,
  file: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired
  }).isRequired
};

export default File;
