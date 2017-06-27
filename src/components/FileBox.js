import React from "react";
import { Table, TableHeader, TableHeaderColumn, TableBody, TableRow, TableRowColumn } from "material-ui/Table";

const FileBox = ({
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
    <TableRow>
    <TableRowColumn>foo</TableRowColumn>
    <TableRowColumn>bar</TableRowColumn>
    </TableRow>
    </TableBody>
    </Table>
    </div>
  );
};

export default FileBox;
