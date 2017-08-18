import React, { Component } from "react";
import PropTypes from "prop-types";

// store
import { connect } from "react-redux";

// material-ui
import SelectField from "material-ui/SelectField";
import Chip from "material-ui/Chip";
import MenuItem from "material-ui/MenuItem";

// actions
import { requestFetchTags, requestAddTag, requestDelTag } from "../../actions";

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
  componentDidMount() {
    this.props.requestFetchTags();
  }

  handleDelete = (file_id, tag) => {
    this.props.requestDelTag(this.props.file, tag);
    this.props.triggerSnackbar("タグを削除しました");
  };

  handleChange = (event, index, value) => {
    this.props.requestAddTag(this.props.file, value);
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
    return (
      <div>
        <div style={{...styles.row, display: "flex"}}>
          {this.props.file.tags.map( (tag, idx) => this.renderTag(tag, idx) )}
        </div>

        <SelectField
          floatingLabelText="タグを追加"
          value={""}
          onChange={this.handleChange} >
          {this.props.tags.map( (tag, idx) => this.renderMenuItem(tag, idx) )}
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

const mapStateToProps = (state, ownProps) => {
  return {
    tags: state.tags.filter(tag => {
      return !ownProps.file.tags.map( t => t._id ).includes(tag._id);
    })
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  requestFetchTags: () => { dispatch(requestFetchTags()); },
  requestAddTag: (file, tag) => { dispatch(requestAddTag(file, tag)); },
  requestDelTag: (file, tag) => { dispatch(requestDelTag(file, tag)); }
});

Tag = connect(mapStateToProps, mapDispatchToProps)(Tag);
  
export default Tag;
