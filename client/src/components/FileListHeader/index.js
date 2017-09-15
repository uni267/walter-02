import React from "react";
import PropTypes from "prop-types";

// material
import Checkbox from 'material-ui/Checkbox';

const FileListHeader = ({
  idx,
  header,
  style,
  setSortTarget,
  toggleSortTarget,
  fileSortTarget,
  sortFile,
  toggleFileCheckAll
}) => {
  const onSortClick = (e) => {
    const target = e.target.dataset.sortKey;
    if (target === undefined) return;

    if (fileSortTarget.sorted !== target) {
      setSortTarget(target);
    } else {
      toggleSortTarget();
    }

    sortFile(
      fileSortTarget.sorted, 
      fileSortTarget.desc
    );
  };

  if ( header.key === "checkbox" ) {
    return (
      <div key={idx} style={{ ...style, width: header.width }}>
        <Checkbox
          onCheck={(e, value) => toggleFileCheckAll(value) }
          style={{ opacity: 0.7 }}
          />
      </div>
    );
  }
  else {
    return (
      <div key={idx}
           onClick={onSortClick}
           data-sort-key={header.key}
           style={{...style, width: header.width}}>
        {header.label}
      </div>
    );
  }
};

FileListHeader.propTypes = {
  header: PropTypes.object.isRequired,
  style: PropTypes.object.isRequired,
  setSortTarget: PropTypes.func.isRequired,
  toggleSortTarget: PropTypes.func.isRequired,
  fileSortTarget: PropTypes.object.isRequired,
  sortFile: PropTypes.func.isRequired
};

export default FileListHeader;
