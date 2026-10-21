import { applyMiddleware, combineReducers, createStore } from "redux";
import { thunk } from "redux-thunk";
import {
  authReducer,
  propertiesReducer,
  usersReducer,
} from "./reducers";

const rootReducer = combineReducers({
  auth: authReducer,
  users: usersReducer,
  properties: propertiesReducer,
});

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
