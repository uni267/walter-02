import React from "react";
import SvgIcon from "material-ui/SvgIcon";
import Timestamp from "./Timestamp";

const FileDocument_TS = ({ timestampStatus }) => (
  <SvgIcon>
    <path d="M6,2A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2H6M6,4H13V9H18V20H6V4M8,12V14H16V12H8M8,16V18H13V16H8Z" />
    <Timestamp status={timestampStatus} />
  </SvgIcon>
)

FileDocument_TS.propTypes = {};

export default FileDocument_TS;
