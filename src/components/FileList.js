import React from "react";
import { Table, TableHeader, TableHeaderColumn, TableBody, TableRow, TableRowColumn } from "material-ui/Table";
import IconButton from 'material-ui/IconButton';
import ActionInfo from 'material-ui/svg-icons/action/info';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import ImageEdit from "material-ui/svg-icons/image/edit";

const FileList = ({
  files,
  onViewClick,
  onDeleteClick,
}) => {
  const styles = {
    smallIcon: {
      width: 24,
      height: 24
    },
    small: {
      width: 42,
      height: 42,
      padding: 4
    }
  }

  return (
    <div className="file-list">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHeaderColumn>id</TableHeaderColumn>
            <TableHeaderColumn>name</TableHeaderColumn>
            <TableHeaderColumn>action</TableHeaderColumn>
          </TableRow>
        </TableHeader>

        <TableBody>
          {files.map(file => {
            return (
              <TableRow key={file.id}>
                <TableRowColumn>{file.id}</TableRowColumn>
                <TableRowColumn>{file.name}</TableRowColumn>
                <TableRowColumn>
                  <IconButton
                    tooltip="詳細"
                    data-file={file}
                    onTouchTap={onViewClick}
                    iconStyle={styles.smallIcon}
                    style={styles.small}
                  >
                    <ActionInfo />
                  </IconButton>
                  <IconButton
                    tooltip="編集"
                    data-file={file}
                    iconStyle={styles.smallIcon}
                    style={styles.small}
                  >
                    <ImageEdit />
                  </IconButton>
                  <IconButton
                    tooltip="削除"
                    iconStyle={styles.smallIcon}
                    style={styles.small}
                    data-file={file}
                    onTouchTap={(e) => onDeleteClick(e, file)}
                  >
                    <ActionDelete />
                  </IconButton>
                </TableRowColumn>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default FileList;
