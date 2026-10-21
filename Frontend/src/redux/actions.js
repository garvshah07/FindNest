import { apiRequest } from "./api";

// Action names are kept here so the actions and reducers are easy to follow.
export const AUTH_REQUEST = "auth/request";
export const AUTH_SUCCESS = "auth/success";
export const AUTH_FAILURE = "auth/failure";
export const AUTH_CLEAR_ERROR = "auth/clearError";
export const AUTH_CLEAR_CREDENTIALS = "auth/clearCredentials";
export const RESET_TOKEN_RECEIVED = "auth/resetTokenReceived";
export const RESET_FLOW_CLEARED = "auth/resetFlowCleared";

const startRequest = () => ({ type: AUTH_REQUEST });
const failRequest = (error) => ({ type: AUTH_FAILURE, payload: error });

export const signup = (userData) => async (dispatch) => {
  dispatch(startRequest());
  try {
    const data = await apiRequest("/user/create", {
      method: "POST",
      body: JSON.stringify(userData),
    });
    dispatch({ type: AUTH_SUCCESS, payload: data });
    return data;
  } catch (error) {
    dispatch(failRequest(error.message));
    throw error;
  }
};

export const login = ({ email, password }) => async (dispatch) => {
  dispatch(startRequest());
  try {
    const data = await apiRequest("/user/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    localStorage.setItem("token", data.token);
    dispatch({ type: AUTH_SUCCESS, payload: data });
    return data;
  } catch (error) {
    dispatch(failRequest(error.message));
    throw error;
  }
};

export const logout = () => (dispatch) => {
  localStorage.removeItem("token");
  dispatch({ type: AUTH_CLEAR_CREDENTIALS });
};

export const requestPasswordReset = (email) => async (dispatch) => {
  dispatch(startRequest());
  try {
    const data = await apiRequest("/user/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
    dispatch({ type: AUTH_SUCCESS, payload: data });
    return data;
  } catch (error) {
    dispatch(failRequest(error.message));
    throw error;
  }
};

export const verifyPasswordResetOtp = ({ email, otp }) => async (dispatch) => {
  dispatch(startRequest());
  try {
    const data = await apiRequest("/user/verify-otp", {
      method: "POST",
      body: JSON.stringify({ email, otp }),
    });
    dispatch({ type: RESET_TOKEN_RECEIVED, payload: data.resetToken });
    return data;
  } catch (error) {
    dispatch(failRequest(error.message));
    throw error;
  }
};

export const resetPassword = ({ resetToken, newPassword }) => async (dispatch) => {
  dispatch(startRequest());
  try {
    const data = await apiRequest("/user/reset-password", {
      method: "POST",
      body: JSON.stringify({ resetToken, newPassword }),
    });
    dispatch({ type: RESET_FLOW_CLEARED });
    return data;
  } catch (error) {
    dispatch(failRequest(error.message));
    throw error;
  }
};

export const clearAuthError = () => ({ type: AUTH_CLEAR_ERROR });

export const getUsers = () => async (dispatch) => {
  const data = await apiRequest("/user");
  dispatch({ type: "users/set", payload: data.users || [] });
  return data.users || [];
};

export const createUser = (userData) => async (dispatch) => {
  const data = await apiRequest("/user/create", {
    method: "POST",
    body: JSON.stringify(userData),
  });
  // Refresh users list
  const usersData = await apiRequest("/user");
  dispatch({ type: "users/set", payload: usersData.users || [] });
  return data;
};

export const updateUser = (id, userData) => async (dispatch) => {
  const data = await apiRequest(`/user/update/${id}`, {
    method: "PUT",
    body: JSON.stringify(userData),
  });
  dispatch({ type: "users/updated", payload: { _id: id, ...userData } });
  return data;
};

export const deleteUser = (id) => async (dispatch) => {
  const data = await apiRequest(`/user/delete/${id}`, { method: "DELETE" });
  dispatch({ type: "users/remove", payload: id });
  return data;
};

export const getProperties = () => async (dispatch) => {
  const data = await apiRequest("/property");
  dispatch({ type: "properties/set", payload: data.properties || [] });
  return data.properties || [];
};

export const createProperty = (propertyData) => async (dispatch) => {
  const data = await apiRequest("/property/create", {
    method: "POST",
    body: JSON.stringify(propertyData),
  });
  // Refresh properties list to get complete documents with _id
  const propsData = await apiRequest("/property");
  dispatch({ type: "properties/set", payload: propsData.properties || [] });
  return data;
};

export const updateProperty = (id, propertyData) => async (dispatch) => {
  const data = await apiRequest(`/property/update/${id}`, {
    method: "PUT",
    body: JSON.stringify(propertyData),
  });
  dispatch({ type: "properties/updated", payload: { _id: id, ...propertyData } });
  return data;
};

export const deleteProperty = (id) => async (dispatch) => {
  const data = await apiRequest(`/property/delete/${id}`, { method: "DELETE" });
  dispatch({ type: "properties/remove", payload: id });
  return data;
};
