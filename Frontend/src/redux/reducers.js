import {
  AUTH_CLEAR_CREDENTIALS,
  AUTH_CLEAR_ERROR,
  AUTH_FAILURE,
  AUTH_REQUEST,
  AUTH_SUCCESS,
  RESET_FLOW_CLEARED,
  RESET_TOKEN_RECEIVED,
} from "./actions";

export function decodeJwt(token) {
  if (!token || typeof token !== "string") return null;
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

const savedToken = localStorage.getItem("token");

const authInitialState = {
  user: decodeJwt(savedToken),
  token: savedToken,
  resetToken: null,
  loading: false,
  error: null,
  message: null,
};

export function authReducer(state = authInitialState, action) {
  switch (action.type) {
    case AUTH_REQUEST:
      return { ...state, loading: true, error: null };
    case AUTH_SUCCESS: {
      const token = action.payload.token || state.token;
      return {
        ...state,
        loading: false,
        error: null,
        message: action.payload.message || null,
        token,
        user: decodeJwt(token) || action.payload.user || state.user,
      };
    }
    case AUTH_FAILURE:
      return { ...state, loading: false, error: action.payload };
    case RESET_TOKEN_RECEIVED:
      return { ...state, loading: false, error: null, resetToken: action.payload };
    case RESET_FLOW_CLEARED:
      return { ...state, loading: false, error: null, resetToken: null };
    case AUTH_CLEAR_ERROR:
      return { ...state, error: null };
    case AUTH_CLEAR_CREDENTIALS:
      return { ...authInitialState, token: null, user: null };
    default:
      return state;
  }
}

export function usersReducer(state = [], action) {
  switch (action.type) {
    case "users/set":
      return Array.isArray(action.payload) ? action.payload : [];
    case "users/created":
      return [...state, action.payload];
    case "users/updated":
      return state.map((user) =>
        user._id === action.payload._id ? { ...user, ...action.payload } : user
      );
    case "users/remove":
      return state.filter((user) => user._id !== action.payload);
    default:
      return state;
  }
}

export function propertiesReducer(state = [], action) {
  switch (action.type) {
    case "properties/set":
      return Array.isArray(action.payload) ? action.payload : [];
    case "properties/created":
      return [...state, action.payload];
    case "properties/updated":
      return state.map((property) =>
        property._id === action.payload._id
          ? { ...property, ...action.payload }
          : property
      );
    case "properties/remove":
      return state.filter((property) => property._id !== action.payload);
    default:
      return state;
  }
}
