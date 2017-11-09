import React from "react";
import PropTypes from "prop-types";

// material
import Checkbox from 'material-ui/Checkbox';
import FlatButton from "material-ui/FlatButton";
import ContentSort from "material-ui/svg-icons/content/sort";

const FileListHeader = ({
  idx,
  header,
  style,
  fileSortTarget,
  match,
  actions
}) => {
  const onSortClick = () => {

    actions.initFilePagination();

    if (fileSortTarget.sorted !== header._id) {
      actions.setSortTarget(header._id);
    } else {
      actions.toggleSortTarget();
    }
  };

  if ( header.name === "file_checkbox" ) {
    const checkboxStyle = {
      ...style,
      paddingLeft: style.paddingLeft + 14,
      width: header.width
    };

    return (
      <div key={idx} style={checkboxStyle}>
        <Checkbox
          onCheck={(e, value) => actions.toggleFileCheckAll(value) }
          style={{ opacity: 0.7 }}
          />
      </div>
    );
  }
  else if ( header.name === "action") {
    return (
      <div key={idx} style={{ ...style, width: header.width}}>
        <FlatButton
          label={header.label}
          labelPosition="before"
          labelStyle={{ color: "rgb(158, 158, 158)", fontSize: 12 }}
          style={{ textAlign: "left" }}
          />
      </div>
    );
  }
  else {
    let sortIcon;

    if ( header._id === fileSortTarget.sorted ) {
      if (fileSortTarget.desc) {
        sortIcon = <ContentSort />;
      }
      else {
        sortIcon = <ContentSort style={{ transform: "rotate(180deg)" }} />;
      }
    }

    return (
      <div key={idx} style={{...style, width: header.width}}>
        <FlatButton
          onClick={() => onSortClick()}
          label={header.label}
          icon={sortIcon}
          labelPosition="before"
          labelStyle={{ color: "rgb(158, 158, 158)", fontSize: 12 }}
          style={{ textAlign: "left" }}
          />
      </div>
    );
  }
};

FileListHeader.propTypes = {
  header: PropTypes.object.isRequired,
  style: PropTypes.object.isRequired
};

export default FileListHeader;
