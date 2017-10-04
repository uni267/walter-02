import React, { Component } from "react";

// store
import { connect } from "react-redux";

// containers
import NavigationContainer from "./NavigationContainer";

// material
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardText, 
  CardMedia, 
  CardActions
} from 'material-ui/Card';
import RaisedButton from "material-ui/RaisedButton";
import Dialog from "material-ui/Dialog";
import FlatButton from "material-ui/FlatButton";

// components
import FileSnackbar from "../components/FileSnackbar";
import Authority from "../components/Authority";
import History from "../components/History";
import Tag from "../components/Tag";
import MetaInfo from "../components/MetaInfo";
import FileBasic from "../components/FileBasic";
import TitleWithGoBack from "../components/Common/TitleWithGoBack";

// actions
import * as actions from "../actions";

const styles = {
  fileImageWrapper: {
    display: "flex"
  },
  innerCard: {
    marginTop: 10,
    marginLeft: 15,
    marginRight: 15
  },
  metaRow: {
    marginTop: 10,
    display: "flex"
  },
  metaCell: {
    marginRight: 20,
    width: "20%"
  }
};

class FileDetailContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editBasic: {
        open: false,
        fileName: ""
      },
      editAuthority: {
        open: false
      },
      editTag: {
        value: ""
      }
    };
  }

  componentDidMount() {
    this.props.requestFetchFile(this.props.match.params.id);
    this.props.requestFetchTags();
    this.props.requestFetchMetaInfos(this.props.tenant.tenant_id);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.match.params.id !== nextProps.match.params.id) {
      this.props.requestFetchFile(nextProps.match.params.id);
      this.props.requestFetchTags();
      this.props.requestFetchMetaInfos(this.props.tenant.tenant_id);
    }
  }

  changeFileName = (ref) => {
    const fileName = ref.getValue();

    if ( fileName === "" ) {
      this.setState({ editBasic: { open: false } });
      return;
    }

    this.props.editFileByView({ ...this.props.file, name: fileName });
    this.props.requestFetchFile(this.props.file._id);
    this.setState({ editBasic: { open: false } });
    this.props.triggerSnackbar("ファイル名を変更しました");
  }

  renderAuthorities = (file) => {
    const renderAuthority = (auth, idx) => {
      return (
        <div key={idx} style={styles.metaRow}>
          <div style={{...styles.metaCell, width: "30%"}}>
            {auth.user.name_jp}
          </div>
          <div>{auth.role.name}</div>
        </div>
      );
    };

    return file.authorities.map( (auth, idx) => renderAuthority(auth, idx));

  };

  renderHistories = (file) => {
    return file.histories.map( (history, idx) => {
      return <History key={idx} history={history} />;
    });
  };

  renderAuthorityDialog = () => {
    const editAuthorityActions = (
      <FlatButton
        label="閉じる"
        primary={true}
        onTouchTap={() => this.setState({ editAuthority: { open: false } })}
        />
    );
    
    return (
      <Dialog
        title="権限を変更"
        modal={false}
        actions={editAuthorityActions}
        open={this.state.editAuthority.open}
        onRequestClose={() => this.setState({ editAuthority: { open: false } })} >

        <Authority
          file={this.props.file}
          users={this.props.users}
          roles={this.props.roles}
          addAuthority={this.props.addAuthority}
          deleteAuthority={this.props.deleteAuthority}
          triggerSnackbar={this.props.triggerSnackbar} />

      </Dialog>
    );
    
  };

  renderMetaInfos = (file) => {
    const render = (meta, idx) => {
      return (
        <div key={idx} style={styles.metaRow}>
          <div style={styles.metaCell}>{meta.key}</div>
          <div style={styles.metaCell}>{meta.value}</div>
        </div>
      );
    };

    return file.meta_infos.map( (meta, idx) => render(meta, idx) );
  };

  renderMetaInfoDialog = () => {
    const actions = (
      <FlatButton
        label="閉じる"
        primary={true}
        onTouchTap={this.props.toggleMetaInfoDialog}
        />
    );

    return (
      <Dialog
        title="メタ情報を編集"
        actions={actions}
        modal={false}
        open={this.props.metaInfo.dialog_open}
        autoScrollBodyContent={true}
        onRequestClose={this.props.toggleMetaInfoDialog} >

        <MetaInfo
          file={this.props.file}
          metaInfo={this.props.metaInfo.meta_infos}
          addMetaInfo={this.props.addMetaInfo}
          deleteMetaInfo={this.props.deleteMetaInfo}
          triggerSnackbar={this.props.triggerSnackbar} />

      </Dialog>
    );
  };

  render() {
    const cardOverlay = (
      <CardTitle subtitle={this.props.file.name} />
    );

    if (! this.props.file._id) return null;

    return (
      <div>
        <NavigationContainer />

        <Card style={{paddingBottom: 10}}>
          <CardHeader title={<TitleWithGoBack title={this.props.file.name} />} />

          <div style={styles.fileImageWrapper}>

            <div style={{width: "70%"}}>

              <Card style={styles.innerCard}>
                <CardMedia overlay={cardOverlay}>
                  <img src="/images/baibaikihon.png" alt="" />
                </CardMedia>
              </Card>

            </div>

            <div style={{width: "30%"}}>

              <Card style={styles.innerCard}>
                <CardHeader title="基本情報" />
                <CardText>

                  <FileBasic
                    file={this.props.file}
                    open={this.state.editBasic.open}
                    changeFileName={this.changeFileName}
                    />

                </CardText>
                <CardActions>
                  <RaisedButton
                    onTouchTap={() => this.setState({ editBasic: { open: true } })}
                    label="編集" />
                </CardActions>
              </Card>

              <Card style={styles.innerCard}>
                <CardHeader title="メンバー" />
                <CardText>
                  {this.renderAuthorities(this.props.file)}
                </CardText>
                <CardActions>
                  <RaisedButton
                    onTouchTap={() => this.setState({ editAuthority: { open: true } })}
                    label="編集"
                    />
                </CardActions>
              </Card>

              <Card style={styles.innerCard}>
                <CardHeader title="タグ" />
                <CardText>

                  <Tag
                    requestDelTag={this.props.requestDelTag}
                    triggerSnackbar={this.props.triggerSnackbar}
                    requestAddTag={this.props.requestAddTag}
                    tags={this.props.tags}
                    file={this.props.file} />

                </CardText>
              </Card>

              <Card style={styles.innerCard}>
                <CardHeader title="メタ情報" />
                <CardText>
                  {this.renderMetaInfos(this.props.file)}
                </CardText>
                <CardActions>
                  <RaisedButton
                    label="編集"
                    onTouchTap={() => this.props.toggleMetaInfoDialog(this.props.file)}
                    />
                </CardActions>
              </Card>

              <Card style={styles.innerCard}>
                <CardHeader title="履歴情報" />
                <CardText>
                  {this.renderHistories(this.props.file)}
                </CardText>
              </Card>

            </div>

          </div>

          {this.renderAuthorityDialog()}
          {this.renderMetaInfoDialog()}

        </Card>

        <FileSnackbar
          closeSnackbar={this.props.closeSnackbar}
          snackbar={this.props.snackbar} />
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    file: state.file,
    roles: state.roles,
    users: state.users,
    snackbar: state.snackbar,
    tags: state.tags,
    loading: state.loading,
    metaInfo: state.metaInfo,
    tenant: state.tenant
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  addAuthorityToFile: (file_id, user, role) => {
    dispatch(actions.addAuthorityToFile(file_id, user, role));
  },
  deleteAuthorityToFile: (file_id, authority_id) => {
    dispatch(actions.deleteAuthorityToFile(file_id, authority_id));
  },
  editFileByView: (file) => dispatch(actions.editFileByView(file)),
  triggerSnackbar: (message) => dispatch(actions.triggerSnackbar(message)),
  addMetaInfo: (file, metaInfo, value) => {
    dispatch(actions.addMetaInfo(file, metaInfo, value));
  },
  deleteMetaInfo: (file, metaInfo) => dispatch(actions.deleteMetaInfo(file, metaInfo)),
  requestFetchFile: (file_id) => dispatch(actions.requestFetchFile(file_id)),
  requestFetchTags: () => dispatch(actions.requestFetchTags()),
  requestAddTag: (file, tag) => dispatch(actions.requestAddTag(file, tag)),
  requestDelTag: (file, tag) => dispatch(actions.requestDelTag(file, tag)),
  requestFetchMetaInfos: (tenant_id) => {
    dispatch(actions.requestFetchMetaInfos(tenant_id));
  },
  toggleMetaInfoDialog: (file) => dispatch(actions.toggleMetaInfoDialog(file))
});

FileDetailContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(FileDetailContainer);

export default FileDetailContainer;
