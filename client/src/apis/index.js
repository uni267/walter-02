import axios from "axios";

export class API {
  constructor() {
    this.client = axios.create({
      headers: {
        "X-Auth-Cloud-Storage": localStorage.getItem("token")
      }
    });
  }

  login = (account_name, password) => {
    const data = { account_name, password };

    return axios.post("/api/login", data).then( res => res );
  };

  fetchUserById = (user_id) => {
    this.client.get(`/api/v1/users/${user_id}`);
  };

  fetchFiles = (dir_id, page, sorted, desc) => {
    const order = desc ? "desc" : "asc";

    const config = {
      params: { dir_id, page, sort: sorted, order }
    };

    return this.client.get("/api/v1/files", config);
  };

  fetchFile = (file_id) => {
    return this.client.get(`/api/v1/files/${file_id}`);
  };

  fetchDirs = (dir_id) => {
    const config = {
      params: {
        dir_id: dir_id
      }
    };

    return this.client.get("/api/v1/dirs", config);
  };

  fetchTags = () => {
    return this.client.get("/api/v1/tags").then(res => res);
  };

  fetchAddTag = (file, tag) => {
    return this.client.post(`/api/v1/files/${file._id}/tags`, tag);
  };

  fetchDelTag = (file, tag) => {
    return this.client.delete(
      `/api/v1/files/${file._id}/tags/${tag._id}`);
  };

  editFile = (file) => {
    return this.client.patch(`/api/v1/files/${file._id}/rename`, file);
  };

  changePassword = (current_password, new_password) => {
    const user_id = localStorage.getItem("userId");
    const body = { current_password, new_password };

    return this.client.patch(`/api/v1/users/${user_id}/password`, body);
  };

  createDir = (dir_id, dir_name) => {
    const token = localStorage.getItem("token");
    const body = { dir_id, dir_name, token };

    return this.client.post(`/api/v1/dirs`, body);
  };

  filesUpload = (dir_id, files) => {
    const form = new FormData();

    form.append("dir_id", dir_id);

    files.forEach( file => {
      file.dir_id = dir_id;
      form.append("myFile[]", file);
    });

    return this.client.post(`/api/v1/files`, form);
  };

  deleteFile = (file, trashDirId) => {
    return this.client.delete(`/api/v1/files/${file._id}`);
  };

  moveFile = (dir, file) => {
    const body = { dir_id: dir._id };
    return this.client.patch(`/api/v1/files/${file._id}/move`, body);
  };

  moveDir = (destinationDir, movingDir) => {
    const body = { destinationDir };
    return this.client.patch(`/api/v1/dirs/${movingDir._id}/move`, body);
  };

  searchFiles = (value, page) => {
    const config = {
      params: { q: value, page }
    };

    return this.client.get(`/api/v1/files/search`, config);
  };

  fetchDirTree = (root_id) => {
    return this.client.get(`/api/v1/dirs/tree/?root_id=${root_id}`);
  };

  fetchMetaInfos = () => {
    return this.client.get(`/api/v1/meta_infos`);
  };

  fetchMetaInfo = (metainfo_id) => {
    return this.client.get(`/api/v1/meta_infos/${metainfo_id}`);
  };

  addMetaInfoToFile = (file, meta, value) => {
    const body = { meta, value };

    return this.client.post(`/api/v1/files/${file._id}/meta`, body);
  };

  deleteMetaInfoToFile = (file, meta) => {
    return this.client.delete(
      `/api/v1/files/${file._id}/meta/${meta.meta_info_id}`);
  }

  fetchUsers = () => {
    return this.client.get(`/api/v1/users`);
  };

  fetchUser = (user_id) => {
    return this.client.get(`/api/v1/users/${user_id}`);
  };

  fetchGroup = () => {
    return this.client.get(`/api/v1/groups`);
  };

  deleteGroupOfUser = (user_id, group_id) => {
    return this.client.delete(
      `/api/v1/users/${user_id}/groups/${group_id}`);
  };

  addGroupOfUser = (user_id, group_id) => {
    const body = { group_id };

    return this.client.post(`/api/v1/users/${user_id}/groups`, body);
  };

  toggleUser = (user_id) => {
    return this.client.patch(`/api/v1/users/${user_id}/enabled`);
  };

  saveUserName = (user) => {
    const body = { name: user.name };

    return this.client.patch(`/api/v1/users/${user._id}/name`, body);
  };

  saveUserAccountName = (user) => {
    const body = { account_name: user.account_name };
    return this.client.patch(`/api/v1/users/${user._id}/account_name`, body);
  };

  saveUserEmail = (user) => {
    const body = { email: user.email };

    return this.client.patch(`/api/v1/users/${user._id}/email`, body);
  };

  saveUserPasswordForce = (user) => {
    const body = { password: user.password };

    return this.client.patch(
      `/api/v1/users/${user._id}/password_force`, body);
  };

  searchUsersSimple = (tenant_id, keyword) => {
    return this.client.get(
      `/api/v1/users/?tenant_id=${tenant_id}&q=${keyword}`);
  };

  fetchGroupById = (group_id) => {
    return this.client.get(`/api/v1/groups/${group_id}`);
  };

  saveGroupName = (group) => {
    const body = { name: group.name };

    return this.client.patch(`/api/v1/groups/${group._id}/name`, body);
  };

  saveGroupDescription = (group) => {
    const body = { description: group.description };

    return this.client.patch(
      `/api/v1/groups/${group._id}/description`, body);
  };

  createUser = (user) => {
    const body = { user };
    body.user.tenant_id = localStorage.getItem("tenantId");
    return this.client.post(`/api/v1/users`, body);
  };

  createGroup = (group) => {
    const body = { group };
    body.group.tenant_id = localStorage.getItem("tenantId");
    return this.client.post(`/api/v1/groups`, body);
  };

  deleteGroup = (group_id) => {
    return this.client.delete(`/api/v1/groups/${group_id}`);
  };

  fetchRoles = () => {
    return this.client.get(`/api/v1/roles`);
  };

  fetchRole = (role_id) => {
    return this.client.get(`/api/v1/roles/${role_id}`);
  };

  saveRoleName = (role) => {
    const body = { name: role.name };
    return this.client.patch(`/api/v1/roles/${role._id}/name`, body);
  };

  saveRoleDescription = (role) => {
    const body = { description: role.description };
    return this.client.patch(
      `/api/v1/roles/${role._id}/description`, body);
  };

  deleteRoleOfAction = (role_id, action_id) => {
    return this.client.delete(
      `/api/v1/roles/${role_id}/actions/${action_id}`);
  };

  createRole = (role) => {
    const body = { role, tenant_id: localStorage.getItem("tenantId") };
    return this.client.post(`/api/v1/roles`, body);
  };

  fetchActions = () => {
    return this.client.get(`/api/v1/actions`);
  };

  addRoleOfAction = (role_id, action_id) => {
    return this.client.patch(
      `/api/v1/roles/${role_id}/actions/${action_id}`);
  };

  deleteRole = (role) => {
    return this.client.delete(`/api/v1/roles/${role._id}`);
  };

  fetchFileSearchItems = () => {
    return this.client.get(`/api/v1/files/search_items`);
  };

  searchFilesDetail = (params, page) => {
    const config = { params };
    config.params.page = page;
    return this.client.get("/api/v1/files/search_detail", config);
  };

  fetchTag = (tag_id) => {
    return this.client.get(`/api/v1/tags/${tag_id}`);
  };

  saveTagLabel = (tag) => {
    const body = {
      label: tag.label
    };

    return this.client.patch(`/api/v1/tags/${tag._id}/label`, body);
  };

  saveTagColor = (tag) => {
    const body = {
      color: tag.color
    };

    return this.client.patch(`/api/v1/tags/${tag._id}/color`, body);
  };

  saveTagDescription = (tag) => {
    const body = {
      description: tag.description
    };

    return this.client.patch(`/api/v1/tags/${tag._id}/description`, body);
  };

  createTag = (tag) => {
    const body = { tag };
    return this.client.post("/api/v1/tags", body);
  };

  deleteTag = (tag_id) => {
    return this.client.delete(`/api/v1/tags/${tag_id}`);
  };

  fetchAnalysis = (tenant_id) => {
    const config = { tenant_id };
    return this.client.get(`/api/v1/analysis`, config);
  };

  toggleStar = (file) => {
    return this.client.patch(`/api/v1/files/${file._id}/toggle_star`);
  };

  downloadFile = (file) => {
    const config = {
      responseType: "arraybuffer",
      params: {
        file_id: file._id
      }
    };

    return this.client.get(`/api/v1/files/download`, config);
  };

  addAuthorityToFile = (file, user, role) => {
    const body = { user, role };
    return this.client.post(
      `/api/v1/files/${file._id}/authorities`, body);
  };

  verifyToken = (token) => {
    const body = { token };
    return this.client.post(`/api/login/verify_token`, body);
  };

  searchTagSimple = (keyword) => {
    const config = {
      params: { q: keyword }
    };

    return this.client.get(`/api/v1/tags`, config);
  };

  searchGroupSimple = (keyword) => {
    const config = {
      params: { q: keyword }
    };

    return this.client.get(`/api/v1/groups`, config);
  };

  createMetaInfo = (metainfo) => {
    return this.client.post("/api/v1/meta_infos", { metainfo });
  };

}

