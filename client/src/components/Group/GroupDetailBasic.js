import React from "react";
import PropTypes from "prop-types";

// material
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';

const GroupDetailBasic = ({
  changedGroup,
  changeGroupName,
  changeGroupDescription,
  saveGroupName,  
  saveGroupDescription,
  displaySaveButton = true
}) => {
  return (
    <div>
      <TextField
        value={changedGroup.name}
        onChange={(e, value) => changeGroupName(value)}
        floatingLabelText="グループ名"
        />

        { displaySaveButton ?
          (
            <FlatButton 
              label="保存"
              onClick={() => {
                saveGroupName(changedGroup);
              }}
              primary={true} />
          ) : null}

      <TextField
        value={changedGroup.description}
        onChange={(e, value) => changeGroupDescription(value)}
        floatingLabelText="備考"
        />

    { displaySaveButton ?
      (
        <FlatButton
          label="保存"
          onClick={() => {
            saveGroupDescription(changedGroup);
          }}
          primary={true} />
      ) : null}

    </div>
  );
};

GroupDetailBasic.propTypes = {
  changedGroup: PropTypes.object.isRequired,
  changeGroupName: PropTypes.func.isRequired,
  changeGroupDescription: PropTypes.func.isRequired,
  // new, edit両方からコールされるので必須ではない
  saveGroupName: PropTypes.func,
  saveGroupDescription: PropTypes.func
};

export default GroupDetailBasic;
