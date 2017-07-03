import React, { Component } from "react";
import { DragDropContextProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import Dir from "./Dir";
import File from "./File";

class DnD extends Component {
  render() {
    return (
      <DragDropContextProvider backend={HTML5Backend}>
        <div>
          <Dir />
          <File name="foo.txt" />
          <File name="bar.txt" />
        </div>
      </DragDropContextProvider>
    );
  }

}

export default DnD;
