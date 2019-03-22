import React from "react";
import PropTypes from "prop-types";
import moment from "moment";

// material ui
import {
  Card,
  CardText,
  CardActions,
} from 'material-ui/Card';
import FlatButton from "material-ui/FlatButton";
import Dialog from "material-ui/Dialog";
import RaisedButton from "material-ui/RaisedButton";
import Paper from "material-ui/Paper";
import { red100 } from "material-ui/styles/colors";

const TimestampDialog = ({
  open,
  openConfirm,
  file,
  actions,
}) => {
  const dialogActions = (
    <FlatButton
      label="閉じる"
      primary={false}
      onClick={actions.toggleTimestampDialog}
    />
  );

  const meta = file && file.meta_infos && file.meta_infos.find(m => m.name === "timestamp")
  const [firstTs, ts] = meta && meta.value && meta.value.length > 0 ? [meta.value[0], meta.value[meta.value.length-1]] : [null, null]
  const stampedDate = ts ? moment(firstTs.stampedDate).format("YYYY-MM-DD HH:mm:ss") : null
  const expirationDate = ts ? moment(ts.expirationDate).format("YYYY-MM-DD HH:mm:ss") : null
  const verifiedDate = ts && ts.verifiedDate ? moment(ts.verifiedDate).format("YYYY-MM-DD HH:mm:ss") : null

  return (
    <Dialog
      title={`タイムスタンプ - ${file.name}`}
      open={open}
      modal={false}
      autoScrollBodyContent={true}
      actions={dialogActions}
    >
      <Card style={{
        marginTop: 10,
        marginLeft: 15,
        marginRight: 15
      }}>
        <CardText>
        開始日時　{stampedDate}<br/>
        有効期限　{expirationDate}<br/>
        検証日時　{verifiedDate}<br/>
        {ts && ts.status === "failed" && (
          <Paper zDepth="0" style={{ backgroundColor:red100, marginTop:5, padding:1, paddingLeft:7 }}>
            { ts.errors.map(e => <p>{e.description}</p>) }
          </Paper>
        )}
        </CardText>
        <CardActions>
          <RaisedButton
            primary={true}
            label="タイムスタンプ発行"
            onClick={actions.toggleTimestampConfirmDialog}
          />
          <RaisedButton
            primary={true}
            disabled={!ts}
            label="タイムスタンプ検証"
            onClick={() => actions.verifyTimestamp(file)}
          />
        </CardActions>
      </Card>

      <TimestampConfirmDialog
        open={openConfirm}
        onSubmit={() => actions.issueTimestamp(file)}
        onClose={actions.toggleTimestampConfirmDialog}
      />

    </Dialog>
  );
};

const TimestampConfirmDialog = ({
  open,
  onSubmit,
  onClose,
}) => {
  const dialogActions = [
    (
      <FlatButton
        label="発行"
        primary={true}
        onClick={onSubmit}
      />
    ),
    (
      <FlatButton
        label="閉じる"
        primary={true}
        onClick={onClose}
      />
    )
  ]
  return (
    <Dialog
      title="タイムスタンプを発行しますか？"
      open={open}
      modal={false}
      autoScrollBodyContent={true}
      actions={dialogActions}
    >
    </Dialog>
  )
}

TimestampDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  file: PropTypes.object,
  actions: PropTypes.object,
};

export default TimestampDialog;
