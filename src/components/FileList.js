import React from "react";
import { Table, TableHeader, TableHeaderColumn, TableBody, TableRow, TableRowColumn } from "material-ui/Table";
import IconButton from 'material-ui/IconButton';
import ActionInfo from 'material-ui/svg-icons/action/info';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import ImageEdit from "material-ui/svg-icons/image/edit";

const FileList = ({
  files
}) => {
  return (
    <div className="file-box">
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
                  <IconButton>
                    <ActionInfo />
                  </IconButton>
                  <IconButton>
                    <ImageEdit />
                  </IconButton>
                  <IconButton>
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
