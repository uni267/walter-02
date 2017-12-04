import React from "react";
import PropTypes from "prop-types";

import RaisedButton from 'material-ui/RaisedButton';

const AddDownloadBtn =({
  actions,
  match,
  isSimple
}) => {
  const dir_id = match.params.id;

  if( isSimple !== undefined){
    return (
      <div>
        <RaisedButton
          label="一覧ダウンロード."
          onTouchTap={() => {
            actions.downloadXlsxFileDetail();
          }} />
      </div>
    );

  }else if (match.path === "/files/search") {
    return (
      <div>
        <RaisedButton
          label="一覧ダウンロード.."
          onTouchTap={() => {
            actions.downloadXlsxFileSimple();
          }} />
      </div>
    );

  }else{
    return (
      <div>
        <RaisedButton
          label="一覧ダウンロード..."
          onTouchTap={() => {
            actions.downloadXlsxFile(dir_id);
          }} />
      </div>
    );
  }

};

AddDownloadBtn.propTypes = {
  actions: PropTypes.object
};

export default AddDownloadBtn;