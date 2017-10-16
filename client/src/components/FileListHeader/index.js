import React from "react";
import PropTypes from "prop-types";

// material
import Checkbox from 'material-ui/Checkbox';

const FileListHeader = ({
  idx,
  header,
  style,
  fileSortTarget,
  match,
  actions
}) => {
  const onSortClick = (e) => {
    const target = e.target.dataset.sortKey;
    if (target === undefined) return;

    if (fileSortTarget.sorted !== target) {
      actions.setSortTarget(target);
    } else {
      actions.toggleSortTarget();
    }

    const dir_id = match.params.id;
    actions.sortFile(dir_id);
  };

  if ( header.key === "checkbox" ) {
    return (
      <div key={idx} style={{ ...style, width: header.width }}>
        <Checkbox
          onCheck={(e, value) => actions.toggleFileCheckAll(value) }
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
  style: PropTypes.object.isRequired
};

export default FileListHeader;
