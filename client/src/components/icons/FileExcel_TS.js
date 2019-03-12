import React from "react";
import SvgIcon from "material-ui/SvgIcon";
import Timestamp from "./Timestamp";

const FileExcel_TS = ({ timestampStatus }) => (
  <SvgIcon>
    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M15.8,20H14L12,16.6L10,20H8.2L11.1,15.5L8.2,11H10L12,14.4L14,11H15.8L12.9,15.5L15.8,20M13,9V3.5L18.5,9H13Z" />
    <Timestamp status={timestampStatus} />
  </SvgIcon>
)

FileExcel_TS.propTypes = {};

export default FileExcel_TS;
