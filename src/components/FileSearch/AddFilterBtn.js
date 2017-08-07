import React from "react";
import PropTypes from "prop-types";

import RaisedButton from 'material-ui/RaisedButton';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';

// ファイル検索でフィルタ追加ボタンをrenderするコンポーネント
const AddFilterBtn =({
  searchItems,
  open,
  anchorEl,
  handleOpen,
  handleClose,
  handleMenuTouchTap
}) => {
  const render = (menu, idx) => {
    return (
      <MenuItem
        key={idx}
        primaryText={menu.label}
        onTouchTap={() => handleMenuTouchTap(menu)}
        />
    );
  };

  return (
    <div>
      <RaisedButton
        label="フィルタ追加"
        onTouchTap={handleOpen} />

      <Popover 
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
        targetOrigin={{horizontal: 'left', vertical: 'top'}}
        onRequestClose={handleClose}
        >

        <Menu>
          {searchItems.map(
          (menu, idx) => !menu.picked ? render(menu, idx) : null)}
        </Menu>
      </Popover>
      
    </div>
  );
};

AddFilterBtn.propTypes = {
  searchItems: PropTypes.array.isRequired,
  open: PropTypes.bool.isRequired,
  anchorEl: PropTypes.object.isRequired,
  handleOpen: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleMenuTouchTap: PropTypes.func.isRequired
};

export default AddFilterBtn;
