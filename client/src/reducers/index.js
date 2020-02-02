import { combineReducers } from "redux";
import messageReducer from './messageReducer';
import conversationReducer from './conversationReducer';
import errorReducer from './errorReducer';
import authReducer from './authReducer';

export default combineReducers({
    message: messageReducer,
    conversation: conversationReducer,
    error: errorReducer,
    auth: authReducer
})
