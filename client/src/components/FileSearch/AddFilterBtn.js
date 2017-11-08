import React from "react";
import PropTypes from "prop-types";

import RaisedButton from 'material-ui/RaisedButton';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';

// ファイル検索でフィルタ追加ボタンをrenderするコンポーネント
const AddFilterBtn =({
  open,
  searchItems,
  anchorElement,
  actions
}) => {
  const renderItem = (item, idx) => {
    return (
      <MenuItem
        key={idx}
        primaryText={item.label}
        onTouchTap={() => actions.searchItemPick(item)}
        />
    );
  };

  return (
    <div>
      <RaisedButton
        label="フィルタ追加"
        onTouchTap={(e) => {
          actions.fileDetailSearchAnchorElement(e);
          actions.toggleFileDetailSearchPopover();
        }} />

      <Popover 
        open={open}
        anchorEl={anchorElement}
        anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
        targetOrigin={{horizontal: 'left', vertical: 'top'}}
        onRequestClose={actions.toggleFileDetailSearchPopover}
        >

        <Menu>
          {searchItems.map( (item, idx) => {
            return !item.picked ? renderItem(item, idx) : null;
          })}
        </Menu>
      </Popover>
      
    </div>
  );
};

AddFilterBtn.propTypes = {
  open: PropTypes.bool.isRequired,
  searchItems: PropTypes.array.isRequired,
  anchorElement: PropTypes.object.isRequired,
  actions: PropTypes.object
};

export default AddFilterBtn;
