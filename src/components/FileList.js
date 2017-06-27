import React from "react";
import { Table, TableHeader, TableHeaderColumn, TableBody, TableRow, TableRowColumn } from "material-ui/Table";

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
          </TableRow>
        </TableHeader>

        <TableBody>
          {files.map(file => {
            return (
              <TableRow key={file.id}>
                <TableRowColumn>{file.id}</TableRowColumn>
                <TableRowColumn>{file.name}</TableRowColumn>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default FileList;
