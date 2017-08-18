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
      "X-Auth-Cloud-Storage": "Bearer " + token
    }
  };

  return axios.get(`/api/v1/users/${user_id}`, config)
    .then(res => res);
};

const fetchFiles = (dir_id) => {
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      "X-Auth-Cloud-Storage": "Bearer " + token
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
      "X-Auth-Cloud-Storage": "Bearer " + token
    }
  };

  return axios.get(`/api/v1/files/${file_id}`, config).then(res => res);
};

const fetchDirs = (dir_id) => {
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      "X-Auth-Cloud-Storage": "Bearer " + token
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
      "X-Auth-Cloud-Storage": "Bearer " + token
    }
  };

  return axios.get("/api/v1/tags", config).then(res => res);
};

const fetchAddTag = (file, tag) => {
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      "X-Auth-Cloud-Storage": "Bearer " + token
    }
  };

  return axios.post(`/api/v1/files/${file._id}/tags`, tag, config)
    .then( res => res );

};

const fetchDelTag = (file, tag) => {
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      "X-Auth-Cloud-Storage": "Bearer " + token
    }
  };

  const url = `/api/v1/files/${file._id}/tags/${tag._id}`;
  console.log(url);
  return axios.delete(url, config)
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
  fetchDelTag
};
