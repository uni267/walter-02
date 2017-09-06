import axios from "axios";

const client = axios.create({
  headers: {
    "X-Auth-Cloud-Storage": localStorage.getItem("token")
  }
});

class API {

  static login(name, password) {
    const data = { email: name, password: password };

    return axios.post("/api/login", data).then( res => res );
  };

  static fetchUserById(user_id) {
    return client.get(`/api/v1/users/${user_id}`).then( res => res );
  }

  static fetchFiles(dir_id) {
    const config = {
      params: {
        dir_id: dir_id
      }
    };

    return client.get("/api/v1/files", config).then(res => res);
  }

  static fetchFile(file_id) {
    return client.get(`/api/v1/files/${file_id}`).then(res => res);
  }

  static fetchDirs(dir_id) {
    const config = {
      params: {
        dir_id: dir_id
      }
    };

    return client.get("/api/v1/dirs", config).then(res => res);
  }

  static fetchTags() {
    return client.get("/api/v1/tags").then(res => res);
  }

  static fetchAddTag(file, tag) {
    return client.post(`/api/v1/files/${file._id}/tags`, tag)
      .then( res => res );
  }

  static fetchDelTag(file, tag) {
    return client.delete(`/api/v1/files/${file._id}/tags/${tag._id}`)
      .then( res => res );
  }

  static editFile(file) {
    return client.patch(`/api/v1/files/${file._id}/rename`, file)
      .then( res => res );
  }

  static changePassword(current_password, new_password) {
    const user_id = localStorage.getItem("userId");
    const body = { current_password, new_password };

    return client.patch(`/api/v1/users/${user_id}/password`, body)
      .then( res => res );
  }

  static createDir(dir_id, dir_name) {
    const token = localStorage.getItem("token");
    const body = { dir_id, dir_name, token };

    return client.post(`/api/v1/dirs`, body).then( res => res );
  }

  static fileUpload(dir_id, file) {

    let form = new FormData();
    form.append("myFile", file);
    form.append("dir_id", dir_id);

    return client.post(`/api/v1/files`, form).then( res => res );
  }

  static deleteFile(file) {
    const body = { dir_id: localStorage.getItem("trashDirId") };

    // ファイル削除はごみ箱への移動なのでapi的にはmoveとする
    return client.patch(`/api/v1/files/${file._id}/move`, body)
      .then( res => res );
  }

  static moveFile(dir, file) {
    const body = { dir_id: dir._id };
    return client.patch(`/api/v1/files/${file._id}/move`, body)
      .then( res => res );
  }

  static moveDir(destinationDir, movingDir) {
    const body = { destinationDir };
    return client.patch(`/api/v1/dirs/${movingDir._id}/move`, body)
      .then( res => res );
  }

  static searchFiles(value) {
    return client.get(`/api/v1/files/search?q=${value}`)
      .then( res => res );
  }

  static fetchDirTree(root_id) {
    return client.get(`/api/v1/dirs/tree/?root_id=${root_id}`)
      .then( res => res );
  }

  static fetchMetaInfos(tenant_id) {
    return client.get(`/api/v1/meta_infos/?tenant_id=${tenant_id}`)
      .then( res => res );
  }

  static addMetaInfo(file, meta, value) {
    const body = { meta, value };

    return client.post(`/api/v1/files/${file._id}/meta`, body)
      .then( res => res );
  }

  static deleteMetaInfo(file, meta) {
    return client.delete(`/api/v1/files/${file._id}/meta/${meta.meta_info_id}`)
      .then( res => res );
  }

  static fetchUsers(tenant_id) {
    return client.get(`/api/v1/users/?tenant_id=${tenant_id}`)
      .then( res => res );
  }

  static fetchUser(user_id) {
    return client.get(`/api/v1/users/${user_id}`)
      .then( res => res );
  }

  static fetchGroup(tenant_id) {
    return client.get(`/api/v1/groups/?tenant_id=${tenant_id}`)
      .then( res => res );
  }

  static deleteGroupOfUser(user_id, group_id) {
    return client.delete(`/api/v1/users/${user_id}/groups/${group_id}`)
      .then( res => res );
  }

  static addGroupOfUser(user_id, group_id) {
    const body = { group_id };

    return client.post(`/api/v1/users/${user_id}/groups`, body)
      .then( res => res );
  }

  static toggleUser(user_id) {
    return client.patch(`/api/v1/users/${user_id}/enabled`)
      .then( res => res );
  }

  static saveUserName(user) {
    const body = { name: user.name };

    return client.patch(`/api/v1/users/${user._id}/name`, body)
      .then( res => res );
  }

  static saveUserEmail(user) {
    const body = { email: user.email };

    return client.patch(`/api/v1/users/${user._id}/email`, body)
      .then( res => res );
  }

  static saveUserPassword(user) {
    const body = { new_password: user.password };

    return client.patch(`/api/v1/users/${user._id}/password`, body)
      .then( res => res );
  }

  static searchUsersSimple(tenant_id, keyword) {
    return client.get(`/api/v1/users/?tenant_id=${tenant_id}&q=${keyword}`)
      .then( res => res );
  }

  static fetchGroupById(group_id) {
    return client.get(`/api/v1/groups/${group_id}`)
      .then( res => res );
  }

  static saveGroupName(group) {
    const body = { name: group.name };

    return client.patch(`/api/v1/groups/${group._id}/name`, body)
      .then( res => res );
  }

  static saveGroupDescription(group) {
    const body = { description: group.description };

    return client.patch(`/api/v1/groups/${group._id}/description`, body)
      .then( res => res );
  }

  static createUser(user) {
    const body = { user };
    body.user.tenant_id = localStorage.getItem("tenantId");
    return client.post(`/api/v1/users`, body).then( res => res );
  }
}

export { API };
