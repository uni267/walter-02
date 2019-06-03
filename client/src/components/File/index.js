import React, { Component } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import { uniq } from "lodash";
import * as _ from "lodash";

// material
import Checkbox from 'material-ui/Checkbox';
import IconButton from 'material-ui/IconButton';

// mateirla-icon
import ActionFavorite from 'material-ui/svg-icons/action/favorite';
import ActionFavoriteBorder from 'material-ui/svg-icons/action/favorite-border';
import ImageBrightness from 'material-ui/svg-icons/image/brightness-1';

// material custom icons
import FileDocument from "../icons/FileDocument";
import FileDocument_TS from "../icons/FileDocument_TS";
import FileWord from "../icons/FileWord";
import FileWord_TS from "../icons/FileWord_TS";
import FilePdf from "../icons/FilePdf";
import FilePdf_TS from "../icons/FilePdf_TS";
import FileImage from "../icons/FileImage";
import FileImage_TS from "../icons/FileImage_TS";
import FileExcel from "../icons/FileExcel";
import FileExcel_TS from "../icons/FileExcel_TS";
import FilePowerPoint from "../icons/FilePowerPoint";
import FilePowerPoint_TS from "../icons/FilePowerPoint_TS";

// components
import FileDialogMenu from "./FileDialogMenu";

import * as constants from "../../constants";

const style = {
  checkbox: {
    display: "flex",
    margin: 0,
    padding: 0
  },
  fileIcon: {
    padding: 0,
    marginRight: 10
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
      hover: false
    };
  }

  renderFileIcon = (file, iconStyle) => {
    const meta = file.meta_infos.find(m => m.name === "timestamp")
    const timestamped = meta && meta.value.length > 0

    let tsStatus
    let fileWordTs
    let fileExcelTs
    let filePowerPointTs
    let filePdfTs
    let fileImageTs
    let fileDocumentTs

    if (timestamped) {
      const ts = meta.value[meta.value.length-1]
      if (ts.status === "Success") {
        const current = moment();
        const expire = moment(ts.expirationDate);
        tsStatus = expire.diff(current, 'y') ? 'normal' : 'warning'

        fileWordTs = <FileWord_TS timestampStatus={tsStatus} />
        fileExcelTs = <FileExcel_TS timestampStatus={tsStatus} />
        filePowerPointTs = <FilePowerPoint_TS timestampStatus={tsStatus} />
        filePdfTs = <FilePdf_TS timestampStatus={tsStatus} />
        fileImageTs = <FileImage_TS timestampStatus={tsStatus} />
        fileDocumentTs = <FileDocument_TS timestampStatus={tsStatus} />
      }
      else {
        tsStatus = "danger"

        const errMsgs = ts.errors.map(e => <div>{e.description}</div> )

        const ErrorTip = ({ children }) => (
          <IconButton
            disableTouchRipple
            tooltip={errMsgs}
            tooltipPosition="top-left"
            iconStyle={{ width: 14, height: 14 }}
            tooltipStyles={{ right:0 }}
            style={{ padding:0, width:'initial', height:'initial', minWidth:24, minHeight:20 }} >
            {children}
          </IconButton>
        )

        fileWordTs = <ErrorTip><FileWord_TS timestampStatus={tsStatus} /></ErrorTip>
        fileExcelTs = <ErrorTip><FileExcel_TS timestampStatus={tsStatus} /></ErrorTip>
        filePowerPointTs = <ErrorTip><FilePowerPoint_TS timestampStatus={tsStatus} /></ErrorTip>
        filePdfTs = <ErrorTip><FilePdf_TS timestampStatus={tsStatus} /></ErrorTip>
        fileImageTs = <ErrorTip><FileImage_TS timestampStatus={tsStatus} /></ErrorTip>
        fileDocumentTs = <ErrorTip><FileDocument_TS timestampStatus={tsStatus} /></ErrorTip>
      }
    }

    switch(file.mime_type) {
      case "application/msword":
      case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      case "application/vnd.openxmlformats-officedocument.wordprocessingml.template":
        return timestamped ? fileWordTs : <FileWord />
      case "application/vnd.ms-excel":
      case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
      case "application/vnd.openxmlformats-officedocument.spreadsheetml.template":
        return timestamped ? fileExcelTs : <FileExcel />
      case "application/vnd.ms-powerpoint":
      case "application/vnd.openxmlformats-officedocument.presentationml.presentation":
      case "application/vnd.openxmlformats-officedocument.presentationml.template":
        return timestamped ? filePowerPointTs : <FilePowerPoint />
      case "application/pdf":
        return timestamped ? filePdfTs : <FilePdf />
      case "image/jpeg":
      case "image/png":
      case "image/gif":
      case "image/tiff":
        return timestamped ? fileImageTs : <FileImage />
      default:
        return timestamped ? fileDocumentTs : <FileDocument />
    }
  }

  renderCell = (header, file, cellStyle, idx) => {
    let body;

    if (header.meta_info_id === null) {
      if (header.name === "authorities") {
        body = this.renderMember();
      }
      else if (header.value_type === "Date") {
        body = moment(file[header.name]).format("YYYY-MM-DD HH:mm");
      }
      else {
        body = file[header.name];
      }
    } else {
      const meta = file.meta_infos.filter( meta => (
        meta._id === header.meta_info_id
      ));

      if (meta.length === 0) {
        body = "未定義";
      } else {
        if (meta[0].value_type === "Date") {
          body = moment(meta[0].value).format("YYYY-MM-DD HH:mm");
        }
        else {
          body = meta[0].value;
        }
      }
    }

    const color = this.state.hover ? "rgb(0, 188, 212)" : "inherit";

    const linkToFileDetail = () => {
      this.props.history.push(`/files/${this.props.file._id}`);
    };

    let element;

    if (this.props.file.dir_route === undefined) {
      if (idx === 0) {
        element = (
          <div
            key={idx}
            onClick={linkToFileDetail}
            style={{ ...cellStyle, width: header.width, color, overflow:'unset' }}>
            <div style={{ ...cellStyle, padding: 0, width: "100%", justifyContent: "center", alignItems: "center", overflow:'unset'}}>
              <div style={{ width: "75%", display: "flex", alignItems: "center" }}>
                <div>
                  {this.renderFileIcon(this.props.file, style.fileIcon)}
                </div>
                <div style={{ marginLeft: 10 }}>
                  {body}
                </div>
              </div>
              <div style={{ width: "25%", display:"flex", flexWrap:"wrap" }}>
                {file.tags.map((tag, tagIdx) => (
                  <IconButton
                    key={(idx * 100) + tagIdx}
                    disableTouchRipple
                    tooltip={tag.label}
                    tooltipPosition="top-left"
                    iconStyle={{ width: 14, height: 14 }}
                    tooltipStyles={{ right:0 }}
                    style={{ padding:0, width:'initial', height:'initial', minWidth:24, minHeight:20 }} >
                    <ImageBrightness color={tag.color} />
                  </IconButton>
                ))}
              </div>
            </div>
          </div>
        );
      }
      else {
        element = (
          <div
            key={idx}
            onClick={linkToFileDetail}
            style={{ ...cellStyle, width: header.width, color }}>
            {body}
          </div>
        );
      }
    } else {
      if (idx === 0) {
        element = (
          <div key={idx} style={{ ...cellStyle, width: header.width, color, overflow:'unset' }}>
            <div style={{ display: "flex", width: "100%", justifyContent: "center", alignItems: "center", flexWrap: "wrap", overflow:'unset' }}>
              <div style={{ width: "75%" }}>
                <div
                  onClick={linkToFileDetail}
                  style={{ display: "flex", alignItems: "center" }}>
                  <div>
                    {this.renderFileIcon(this.props.file, style.fileIcon)}
                  </div>
                  <div style={{ marginLeft: 10 }}>
                    {body}
                  </div>
                </div>
                <div style={{ fontSize: 12, color: "#aaa"}}
                     onClick={() => (
                       this.props.history.push(`/home/${this.props.file.dir_id}`)
                  )}>
                  場所:
                  {this.props.file.dir_route === ""
                  ? constants.TOP_DIR_NAME : this.props.file.dir_route }
                </div>
              </div>
              <div style={{ width: "25%", display:"flex", flexWrap:"wrap" }}>
                {file.tags.map((tag, tagIdx) => (
                  <IconButton
                    key={(idx * 100) + tagIdx}
                    disableTouchRipple
                    tooltip={tag.label}
                    tooltipPosition="top-left"
                    iconStyle={{ width: 14, height: 14 }}
                    tooltipStyles={{ right:0 }}
                    style={{ padding:0, width:'initial', height:'initial', minWidth:24, minHeight:20 }} >
                    <ImageBrightness color={tag.color} />
                  </IconButton>
                ))}
              </div>
            </div>
          </div>
        );
      } else {
        element = (
          <div key={idx} style={{ ...cellStyle, width: header.width, color }}>
            <div onClick={linkToFileDetail} style={{ width: "100%" }}>
              {body}
            </div>
          </div>
        );
      }
    }

    return element;
  };

  renderMember = () => {
    const { authorities } = this.props.file;
    const firstMemberName = _.get(authorities[0], 'users.name') || _.get(authorities[0], 'groups.name') || 'none'  //super user が実装されると、権限ゼロの時に'none'表示される

    const member = authorities.length > 1
          ? `${authorities.length} 人のメンバー`
          : `${firstMemberName} のみ`;

    return (
      <span>
        {member}
      </span>
    );
  };

  render() {
    // headersはインデックス決め打ちなのでjsonを取得できるまではrenderしない
    if (this.props.headers.length === 0) return null;

    const { isDragging, connectDragSource, file } = this.props;
    const { rowStyle, cellStyle, headers } = this.props;

    const opacity = isDragging ? 0.3 : 1;

    const backgroundColor = file.checked ? "rgb(232, 232, 232)" : "inherit";

    const checkOpacity = this.state.hover || file.checked ? 1 : 0.1;

    // react-dndの仕様でinjectされたDnDコンポーネントの関数でラップし返却する
    const canMove = file.actions.filter(action => action.name === constants.PERMISSION_MOVE).length > 0
    const elements = (
      <div
        onMouseEnter={() => this.setState({ hover: true })}
        onMouseLeave={() => this.setState({ hover: false })}
        >
        <div style={{ ...rowStyle, opacity, backgroundColor }}>
          <div style={{ ...cellStyle, width: headers[0].width }}>
            <Checkbox
              checked={file.checked}
              style={{ ...style.checkbox, opacity: checkOpacity }}
              onCheck={() => {
                this.props.actions.setPageYOffset(window.pageYOffset)
                this.props.actions.toggleFileCheck(file);
              }} />

            <Checkbox
              style={style.checkbox}
              checkedIcon={<ActionFavorite />}
              uncheckedIcon={<ActionFavoriteBorder />}
              checked={file.is_star}
              onCheck={() => {
                this.props.actions.setPageYOffset(window.pageYOffset)
                this.props.actions.toggleStar(file)
              }} />
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
        <div style={{ ...rowStyle, display: 'block', 'font-size': '12px',  opacity, backgroundColor }} dangerouslySetInnerHTML={{__html: file.search_result}} ></div>
      </div>
    );
    
    return connectDragSource && canMove ? connectDragSource(elements) : elements;
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
