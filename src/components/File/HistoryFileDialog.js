import React from "react";
import PropTypes from "prop-types";

// material ui
import FlatButton from "material-ui/FlatButton";
import Dialog from "material-ui/Dialog";

// components
import History from "../History";

const HistoryFileDialog = ({
  open,
  handleClose,
  file
}) => {
  const actions = (
    <FlatButton
      label="close"
      primary={false}
      onTouchTap={() => handleClose()}
      />
  );

  const render = (history, idx) => {
    return (
      <History key={idx} history={history} />        
    );
  };

  return (
    <Dialog
      title="履歴"
      open={open}
      modal={false}
      autoScrollBodyContent={true}
      actions={actions} >

      {file.histories.map( (history, idx) => render(history, idx))}

    </Dialog>
    
  );
};

HistoryFileDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  file: PropTypes.object
};

export default HistoryFileDialog;

