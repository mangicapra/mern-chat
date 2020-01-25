import { combineReducers } from "redux";
import messageReducer from './messageReducer';
import errorReducer from './errorReducer';
import authReducer from './authReducer';

export default combineReducers({
    message: messageReducer,
    error: errorReducer,
    auth: authReducer
})
