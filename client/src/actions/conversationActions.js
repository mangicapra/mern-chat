import { GET_CONVERSATIONS } from "./types";
import axios from 'axios';

export const getConversationUsers = token => dispatch => {
    axios.get('http://localhost:8080/api/conversations/users', {
        headers: {
            "Content-Type": "application/json",
            "token": token
        }
    })
    .then(res => res.data).then(data => dispatch({
        type: GET_MESSAGES,
        payload: data
    }))
    .catch(err => console.log(err));
};