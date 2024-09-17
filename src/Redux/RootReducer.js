import { combineReducers } from "redux";
import AuthenticationReducer from "./Authentication/AuthenticationReducer";

const rootReducer = combineReducers({
  auth: AuthenticationReducer,
});

export default rootReducer;
