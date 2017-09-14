import { fork } from "redux-saga/effects";

import watchLogin from "./watchLogin";
import watchLogout from "./watchLogout";
import watchFetchFiles from "./watchFetchFiles";
import watchFetchFile from "./watchFetchFile";
import watchFetchTags from "./watchFetchTags";
import watchAddTag from "./watchAddTag";
import watchDelTag from "./watchDelTag";
import watchEditFileByView from "./watchEditFileByView";
import watchEditFileByIndex from "./watchEditFileByIndex";
import watchChangePassword from "./watchChangePassword";
import watchCreateDir from "./watchCreateDir";
import watchDeleteFile from "./watchDeleteFile";
import watchUploadFiles from "./watchUploadFiles";
import watchMoveFile from "./watchMoveFile";
import watchSearchFileSimple from "./watchSearchFileSimple";
import watchFetchDirTree from "./watchFetchDirTree";
import watchMoveDir from "./watchMoveDir";
import watchFetchMetaInfo from "./watchFetchMetaInfo";
import watchAddMetaInfo from "./watchAddMetaInfo";
import watchDeleteMetaInfo from "./watchDeleteMetaInfo";
import watchFetchUsers from "./watchFetchUsers";
import watchFetchUser from "./watchFetchUser";
import watchDeleteGroupOfUser from "./watchDeleteGroupOfUser";
import watchAddGroupOfUser from "./watchAddGroupOfUser";
import watchToggleUser from "./watchToggleUser";
import watchSaveUserName from "./watchSaveUserName";
import watchSaveUserEmail from "./watchSaveUserEmail";
import watchSearchUsersSimple from "./watchSearchUsersSimple";
import watchFetchGroups from "./watchFetchGroups";
import watchFetchGroup from "./watchFetchGroup";
import watchSaveGroupName from "./watchSaveGroupName";
import watchSaveGroupDescription from "./watchSaveGroupDescription";
import watchCreateUser from "./watchCreateUser";
import watchCreateGroup from "./watchCreateGroup";
import watchSaveUserPasswordForce from "./watchSaveUserPasswordForce";
import watchDeleteGroup from "./watchDeleteGroup";
import watchFetchRoles from "./watchFetchRoles";
import watchFetchRole from "./watchFetchRole";
import watchSaveRoleName from "./watchSaveRoleName";
import watchSaveRoleDescription from "./watchSaveRoleDescription";
import watchDeleteRoleOfAction from "./watchDeleteRoleOfAction";
import watchCreateRole from "./watchCreateRole";
import watchFetchActions from "./watchFetchActions";
import watchAddRoleOfAction from "./watchAddRoleOfAction";
import watchDeleteRole from "./watchDeleteRole";
import watchFetchFileSearchItems from "./watchFetchFileSearchItems";
import watchSearchFileDetail from "./watchSearchFileDetail";
import watchFetchTag from "./watchFetchTag";
import watchSaveTagLabel from "./watchSaveTagLabel";
import watchSaveTagColor from "./watchSaveTagColor";
import watchSaveTagDescription from "./watchSaveTagDescription";

function* Saga() {
  yield fork(watchLogin);
  yield fork(watchLogout);
  yield fork(watchFetchFiles);
  yield fork(watchFetchFile);
  yield fork(watchFetchTags);
  yield fork(watchAddTag);
  yield fork(watchDelTag);
  yield fork(watchEditFileByView);
  yield fork(watchEditFileByIndex);
  yield fork(watchChangePassword);
  yield fork(watchCreateDir);
  yield fork(watchDeleteFile);
  yield fork(watchUploadFiles);
  yield fork(watchMoveFile);
  yield fork(watchSearchFileSimple);
  yield fork(watchFetchDirTree);
  yield fork(watchMoveDir);
  yield fork(watchFetchMetaInfo);
  yield fork(watchAddMetaInfo);
  yield fork(watchDeleteMetaInfo);
  yield fork(watchFetchUsers);
  yield fork(watchFetchUser);
  yield fork(watchDeleteGroupOfUser);
  yield fork(watchAddGroupOfUser);
  yield fork(watchToggleUser);
  yield fork(watchSaveUserName);
  yield fork(watchSaveUserEmail);
  yield fork(watchSearchUsersSimple);
  yield fork(watchFetchGroups);
  yield fork(watchFetchGroup);
  yield fork(watchSaveGroupName);
  yield fork(watchSaveGroupDescription);
  yield fork(watchCreateUser);
  yield fork(watchCreateGroup);
  yield fork(watchSaveUserPasswordForce);
  yield fork(watchDeleteGroup);
  yield fork(watchFetchRoles);
  yield fork(watchFetchRole);
  yield fork(watchSaveRoleName);
  yield fork(watchSaveRoleDescription);
  yield fork(watchDeleteRoleOfAction);
  yield fork(watchCreateRole);
  yield fork(watchFetchActions);
  yield fork(watchAddRoleOfAction);
  yield fork(watchDeleteRole);
  yield fork(watchFetchFileSearchItems);
  yield fork(watchSearchFileDetail);
  yield fork(watchFetchTag);
  yield fork(watchSaveTagLabel);
  yield fork(watchSaveTagColor);
  yield fork(watchSaveTagDescription);
}

export default Saga;
