import React from "react";
import PropTypes from "prop-types";

const FileListHeader = ({
  idx,
  header,
  style,
  setSortTarget,
  toggleSortTarget,
  fileSortTarget,
  sortFile
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

  return (
    <div key={idx}
         onClick={onSortClick}
         data-sort-key={header.key}
         style={{...style, width: header.width}}>
      {header.label}
    </div>
  );
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
