import axios from "axios";

// @todo urlはconstants or configs などに保存する
const login = (name, password) => {
  const data = { email: name, password: password };
  return axios.post("/api/login", data).then( res => res );

};

const fetchUserById = (user_id) => {
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      "X-Auth-Cloud-Storage": token
    }
  };

  return axios.get(`/api/v1/users/${user_id}`, config)
    .then(res => res);
};

const fetchFiles = (dir_id) => {
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      "X-Auth-Cloud-Storage": token
    },
    params: {
      dir_id: dir_id
    }
  };

  return axios.get("/api/v1/files", config).then(res => res);
};

const fetchFile = (file_id) => {
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      "X-Auth-Cloud-Storage": token
    }
  };

  return axios.get(`/api/v1/files/${file_id}`, config).then(res => res);
};

const fetchDirs = (dir_id) => {
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      "X-Auth-Cloud-Storage": token
    },
    params: {
      dir_id: dir_id
    }
  };

  return axios.get("/api/v1/dirs", config).then(res => res);
};

const fetchTags = () => {
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      "X-Auth-Cloud-Storage": token
    }
  };

  return axios.get("/api/v1/tags", config).then(res => res);
};

const fetchAddTag = (file, tag) => {
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      "X-Auth-Cloud-Storage": token
    }
  };

  return axios.post(`/api/v1/files/${file._id}/tags`, tag, config)
    .then( res => res );

};

const fetchDelTag = (file, tag) => {
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      "X-Auth-Cloud-Storage": token
    }
  };

  const url = `/api/v1/files/${file._id}/tags/${tag._id}`;
  console.log(url);
  return axios.delete(url, config)
    .then( res => res );

};

const editFile = (file) => {
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      "X-Auth-Cloud-Storage": token
    }
  };

  return axios.patch(`/api/v1/files/${file._id}`, file, config)
    .then( res => res );
};

const changePassword = (current_password, new_password) => {
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      "X-Auth-Cloud-Storage": token
    }
  };

  const user_id = localStorage.getItem("userId");
  const body = { current_password, new_password };
  return axios.patch(`/api/v1/users/${user_id}/password`, body, config)
    .then( res => res );
};

const createDir = (dir_id, dir_name) => {
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      "X-Auth-Cloud-Storage": token
    }
  };

  const body = { dir_id, dir_name, token };

  return axios.post(`/api/v1/dirs`, body, config)
    .then( res => res );
};

export {
  login,
  fetchUserById,
  fetchFiles,
  fetchFile,
  fetchDirs,
  fetchTags,
  fetchAddTag,
  fetchDelTag,
  editFile,
  changePassword,
  createDir
};
