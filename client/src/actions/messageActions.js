import { GET_MESSAGES } from "./types";
import axios from 'axios';

export const getMessages = token => dispatch => {
    axios.get('http://localhost:8080/api/message', {
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

export const sendMessage = (token, message, socket) => dispatch => {
    axios.post('http://localhost:8080/api/message', JSON.stringify(message), {
        headers: {
            "Content-Type": "application/json",
            "token": token
        }
    })
    .then(res => res.data).then(data => socket.emit('new-message', data))
    .catch(err => console.log(err));
};

export const deleteMessage = (token, id, socket) => dispatch => {
    axios.delete(`http://localhost:8080/api/message/${id}`, {
        headers: {
            "Content-Type": "application/json",
            "token": token
        }
    }).then(res => res.data).then(data => socket.emit('delete-message', id))
};
