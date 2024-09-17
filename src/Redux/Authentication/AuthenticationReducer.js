import { LOGIN, LOGOUT } from "./AuthenticationTypes";

const initialState = {
  userId: "",
  userName: "",
  userCredential: "",
  password: "",
  role: "",
  token: "",
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN:
      return action.payload;

    case LOGOUT:
      return initialState;

    default:
      return state;
  }
};

export default authReducer;
