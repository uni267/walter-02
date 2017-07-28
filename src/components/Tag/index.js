import React, { Component } from "react";
import PropTypes from "prop-types";

// material-ui
import SelectField from "material-ui/SelectField";
import Chip from "material-ui/Chip";
import MenuItem from "material-ui/MenuItem";

// mock
import TAGS from "../../mock-tags";

const styles = {
  row: {
    marginTop: 10,
    display: "flex"
  },
  cell: {
    marginRight: 20,
    width: "20%"
  }
};

class Tag extends Component {
  handleDelete = (file_id, tag) => {
    this.props.deleteTag(file_id, tag);
    this.props.triggerSnackbar("タグを削除しました");
  };

  handleChange = (event, index, value) => {
    this.props.addTag(this.props.file.id, value);
    this.props.triggerSnackbar("タグを追加しました");
  };

  renderTag = (tag, idx) => {
    return (
      <Chip
        key={idx}
        style={{marginLeft: 10}}
        onRequestDelete={() => this.handleDelete(this.props.file.id, tag)}
        >
        {tag.label}
      </Chip>
    );
  };

  renderMenuItem = (tag, idx) => {
    return (
      <MenuItem key={idx} value={tag} primaryText={tag.label} />
    );
  };

  render() {
    const tags = TAGS.filter(
      tag => !this.props.file.tags.map(t => t.id).includes(tag.id)
    );

    return (
      <div>
        <div style={{...styles.row, display: "flex"}}>
          {this.props.file.tags.map( (tag, idx) => this.renderTag(tag, idx) )}
        </div>

        <SelectField
          floatingLabelText="タグを追加"
          value={""}
          onChange={this.handleChange} >
          {tags.map( (tag, idx) => this.renderMenuItem(tag, idx) )}
        </SelectField>
      </div>
    );
  }

}

Tag.propTypes = {
  file: PropTypes.object.isRequired,
  addTag: PropTypes.func.isRequired,
  deleteTag: PropTypes.func.isRequired,
  triggerSnackbar: PropTypes.func.isRequired
};

export default Tag;
