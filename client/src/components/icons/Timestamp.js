import React from "react";
import SvgIcon from "material-ui/SvgIcon";
import {
  grey800,
  green400,
  yellow600,
  redA700,
} from 'material-ui/styles/colors';

const Timestamp = ({ status }) => {
  const fillColor = choosefillColor(status)
  return (
    <SvgIcon>
      <ellipse stroke="null" ry="5.623434" rx="5.718746" id="svg_3" cy="17.338277" cx="17.437498" stroke-opacity="null" stroke-width="null" fill="#ffffff"/>
      <path stroke="null" id="svg_2" fill={fillColor} d="m17.468748,22.052065a4.625002,4.625002 0 0 0 4.625002,-4.625002a4.625002,4.625002 0 0 0 -4.625002,-4.625002a4.625002,4.625002 0 0 0 -4.625002,4.625002a4.625002,4.625002 0 0 0 4.625002,4.625002m0,-10.406254a5.781252,5.781252 0 0 1 5.781252,5.781252a5.781252,5.781252 0 0 1 -5.781252,5.781252c-3.197033,0 -5.781252,-2.601564 -5.781252,-5.781252a5.781252,5.781252 0 0 1 5.781252,-5.781252m0.289063,2.890626l0,3.035158l2.601564,1.543594l-0.433594,0.711094l-3.035158,-1.821095l0,-3.468751l0.867188,0z"/>
    </SvgIcon>
  )
}

const choosefillColor = status => {
  switch(status) {
    case "normal":
      return green400
    case "warning":
      return yellow600
    case "danger":
      return redA700
    default:
      return grey800
  }
}

Timestamp.propTypes = {};

export default Timestamp;
