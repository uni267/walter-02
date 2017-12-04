import React from "react";
import PropTypes from "prop-types";

import RaisedButton from 'material-ui/RaisedButton';

const AddDownloadBtn =({
  actions,
  match
}) => {
  const dir_id = match.params.id;
  return (
    <div>
      <RaisedButton
        label="一覧ダウンロード"
        onTouchTap={() => {
          actions.downloadXlsxFile(dir_id);
        }} />
    </div>
  );

};

AddDownloadBtn.propTypes = {
  actions: PropTypes.object
};

export default AddDownloadBtn;