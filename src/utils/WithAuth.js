import { Navigate } from "react-router-dom";
import axios from "axios";
import { setSessionTrue } from "../pages/redux/features/session/sessionslice";

export const ProtectedRoute = ({ user, children }) => {
  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  return children;
};

export const ProtectedAuthRoute = ({ user, children }) => {
  if (user) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export const executeApi = async (url, body = null, method = 'GET', authToken = null, dispatch) => {
  try {
    let config = {
      method,
      url,
      headers: {
        'Authorization': authToken ? `Bearer ${authToken}` : undefined,
      },
    };

    if (body) {
      config.data = body;
    }
    const response = await axios(config);
    return response.data;
  } catch (error) {
    if (error?.response?.status == 401) {
      dispatch(setSessionTrue())
    }
    throw new Error('API call failed');
  }
};