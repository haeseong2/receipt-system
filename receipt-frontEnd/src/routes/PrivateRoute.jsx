import { Navigate } from "react-router-dom";

function PrivateRoute({ children }) {

  const isLogin = sessionStorage.getItem("LOGIN_USER");

  return isLogin
    ? children
    : <Navigate to="/" replace />;
}

export default PrivateRoute;