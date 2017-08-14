import axios from "axios";

// @todo urlはconstants or configs などに保存する
const login = (name, password) => {
  const data = { email: name, password: password };
  return axios.post("/api/login", data).then( res => res );

};

const getUsers = () => {
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      "X-Auth-Cloud-Storage": "Bearer " + token
    }
  };

  return axios.get("/api/v1/users", config)
    .then( res => res );
};

export { login, getUsers };
