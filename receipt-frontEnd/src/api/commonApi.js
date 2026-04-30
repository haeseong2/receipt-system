import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
  withCredentials: true
});

api.interceptors.response.use(
  res => res,
  err => {

    if(err.response &&err.response.status === 401){
      sessionStorage.clear();
      window.location = "/";
    }
    return Promise.reject(err);
  }
);

export default api;