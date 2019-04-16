import React from "react";
import SvgIcon from "material-ui/SvgIcon";
import Timestamp from "./Timestamp";

const FileWord_TS = ({ timestampStatus }) => (
  <SvgIcon>
    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M15.2,20H13.8L12,13.2L10.2,20H8.8L6.6,11H8.1L9.5,17.8L11.3,11H12.6L14.4,17.8L15.8,11H17.3L15.2,20M13,9V3.5L18.5,9H13Z" />
    <Timestamp status={timestampStatus} />
  </SvgIcon>
)

FileWord_TS.propTypes = {};

export default FileWord_TS;
