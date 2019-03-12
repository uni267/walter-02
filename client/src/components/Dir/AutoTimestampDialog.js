import React, { Fragment } from "react";
import PropTypes from "prop-types";

// material ui
import Dialog from "material-ui/Dialog";
import FlatButton from "material-ui/FlatButton";
import Toggle from "material-ui/Toggle";
import Subheader from "material-ui/Subheader";

const AutoTimestampDialog = ({
  dir,
  open,
  actions,
  enable,
}) => {
  const dialogActions = [
    (
      <FlatButton
        label="閉じる"
        primary={false}
        onTouchTap={actions.toggleAutoTimestampDialog}
        />
    )
  ];

  return (
    <Dialog
      title={`タイムスタンプ自動発行 - ${dir.name}`}
      modal={false}
      actions={dialogActions}
      open={open}
      // onRequestClose={actions.toggleAutoTimestampDialog}
      contentStyle={{ maxWidth: 600 }}
      >
      <div>
        <Subheader>フォルダ直下にアップロードされたファイルにタイムスタンプを付与します。</Subheader>
        <div style={{ marginLeft: 20 }}>
          <Toggle
            toggled={enable}
            label={ enable ? "On" : "Off" }
            labelPosition="right"
            onToggle={() => actions.toggleAutoTimestamp(dir, !enable)}
            />
        </div>
      </div>
    </Dialog>
  );
};

AutoTimestampDialog.propTypes = {
  dir: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  actions: PropTypes.object,
  enable: PropTypes.bool.isRequired,
};

export default AutoTimestampDialog;
