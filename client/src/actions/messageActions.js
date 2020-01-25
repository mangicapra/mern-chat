import { GET_MESSAGES, SEND_MESSAGE, DELETE_MESSAGE, SOCKET_EMIT } from "./types";
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

export const sendMessage = (token, message) => dispatch => {
    axios.post('http://localhost:8080/api/message', JSON.stringify(message), {
        headers: {
            "Content-Type": "application/json",
            "token": token
        }
    })
    .then(res => res.data).then(data => dispatch({
            type: SEND_MESSAGE,
            payload: message
    })
    )
    .catch(err => console.log(err));
};

export const deleteMessage = (token, id) => dispatch => {
    axios.delete(`http://localhost:8080/api/message/${id}`, {
        headers: {
            "Content-Type": "application/json",
            "token": token
        }
    }).then(res => res.data).then(data => dispatch({
        type: DELETE_MESSAGE,
        payload: id
    }))
};

/**
 * Emit socket acctions
 */
export const addNewMessageSocket = (socket, message) => {
	return (dispatch) => {
	    socket.emit('new-message', message)		
	}
}

export const removeMessageSocket = (socket, messageId) => {
    return (dispatch) => {
	    socket.emit('delete-message', messageId)		
	}
}