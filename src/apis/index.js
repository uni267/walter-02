import axios from "axios";

const loginAPI = (name, password) => {
  return axios.post("http://127.0.0.1:3333/api/login", {
    email: name,
    password: password
  }).then( res => res );
};

export { loginAPI };
