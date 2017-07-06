import React, { Component } from "react";

// store
import { connect } from "react-redux";

// material
import Dialog from "material-ui/Dialog";
import FlatButton from "material-ui/FlatButton";
import MenuItem from "material-ui/MenuItem";
import FileCloudUpload from "material-ui/svg-icons/file/cloud-upload";

// DnD
import Dropzone from "react-dropzone";

// datetime
import moment from "moment";

class AddFileDialog extends Component {
  constructor(props) {
    super(props);

    this.state = {
      files: [],
      open: false
    };
  }

  render() {
    const styles = {
      dropzone: {
        width: "80%",
        height: "80%",
        borderStyle: "dashed",
        borderColor: "gray",
        borderWidth: 3,
        padding: 50
      }
    };

    const onDrop = (files) => {
      let _files = this.state.files.slice();

      files.forEach(f => {
        const push_file = {
          name: f.name,
          modified: moment().format("YYYY-MM-DD HH:mm"),
          owner: "user01",
          dir_id: Number(this.props.dir_id),
          is_dir: false,
          is_display: true
        };

        _files.push(push_file);
      });

      console.log(Number(this.props.dir_id));
      this.setState({ files: _files });
    };

    const handleUpload = () => {
      this.state.files.forEach(file => {
        this.props.dispatch({
          type: "ADD_FILE",
          name: file.name,
          modified: file.modified,
          owner: file.owner,
          is_dir: file.is_dir,
          dir_id: file.dir_id,
          is_display: file.is_display
        });

        this.props.dispatch({
          type: "TRIGGER_SNACK",
          message: `${file.name}をアップロードしました`
        });
      });

      this.setState({ open: false, files: [] });
    };

    const upload_button = <FileCloudUpload />;

    const actions = [
        <FlatButton
      label="Cancel"
      primary={true}
      onTouchTap={() => this.setState({ open: false, files: [] })}
        />,

      <FlatButton
        label="Upload"
        primary={true}
        keyboardFocused={true}
        onTouchTap={handleUpload}
        />,
    ];

    return (
      <div>
        <MenuItem
          primaryText="ファイルをアップロード"
          leftIcon={upload_button}
          onTouchTap={() => this.setState({ open: true })}
          />

        <Dialog
          title="ファイルをアップロード"
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={() => this.setState({ open: false})}
          >
          <Dropzone onDrop={onDrop} style={styles.dropzone}>
            <p>クリックもしくはファイルをドロップ</p>
          </Dropzone>
          <ul>
            {this.state.files.map( (f, idx) => {
              return <li key={idx}>{f.name} - {f.size} bytes</li>;
            })}
          </ul>
        </Dialog>
      </div>
    );
  }
}

AddFileDialog = connect()(AddFileDialog);
export default AddFileDialog;
