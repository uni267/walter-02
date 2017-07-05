import React, { Component } from "react";

// material
import Dialog from "material-ui/Dialog";
// import IconButton from "material-ui/IconButton";
import FlatButton from "material-ui/FlatButton";
// import ActionInfo from "material-ui/svg-icons/action/info";

// store
import { connect } from "react-redux";

class DeleteIcon extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false
    };

    this.styles = {
      smallIcon: {
        width: 24,
        height: 24
      },
      small: {
        width: 42,
        height: 42,
        padding: 4
      }
    };
  }

  render() {
    const actions = [
      <FlatButton
        label="Delete"
        primary={true}
        onTouchTap={(e) => {
          this.setState({ open: false });
          dispatch({
            type: "TRIGGER_SNACK",
            message: `${file.name}を削除しました`
          });

          dispatch({
            type: "DELETE_FILE",
            file: file
          });
        }}
      />,
      <FlatButton
        label="close"
        primary={false}
        onTouchTap={() => this.setState({ open: false })}
      />
    ];

    const { file, dispatch } = this.props;

    return (
      <div>
        <span onClick={() => this.setState({open: true})}>
          delete
        </span>
        <Dialog
          title={`${file.name}を削除しますか？`}
          modal={false}
          actions={actions}
          open={this.state.open}
          onRequestClose={() => this.setState({open: false})}
        >
        </Dialog>

      </div>
    );
  }
}

DeleteIcon = connect()(DeleteIcon);
export default DeleteIcon;
