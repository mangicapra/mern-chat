import { GET_CONVERSATIONS } from "./types";
import axios from 'axios';

export const getConversationUsers = token => dispatch => {
    // axios.get('http://localhost:8080/api/conversations/users', {
    //     headers: {
    //         "Content-Type": "application/json",
    //         "token": token
    //     }
    // })
    // .then(res => res.data).then(data => dispatch({
    //     type: GET_MESSAGES,
    //     payload: data
    // }))
    // .catch(err => console.log(err));
};

export const newConversation = (token, id, socket) => dispatch => {
    console.log(id)
    axios.post('http://localhost:8080/api/conversations', JSON.stringify({id}), {
        headers: {
            "Content-Type": "application/json",
            "token": token
        }
    })
    .then(res => res.data).then(data => socket.emit('add-conversation', data))
    .catch(err => console.log(err));
}

export const getConversations = token => dispatch => {
    axios.get('http://localhost:8080/api/conversations', {
        headers: {
            "Content-Type": "application/json",
            "token": token
        }
    })
    .then(res => res.data).then(data => dispatch({
        type: GET_CONVERSATIONS,
        payload: data
    }))
    .catch(err => console.log(err));
}

export const deleteConversation = (token, id, socket) => dispatch => {
    axios.delete(`http://localhost:8080/api/conversations/${id}`, {
        headers: {
            "Content-Type": "application/json",
            "token": token
        }
    }).then(res => res.data).then(data => socket.emit('delete-conversation', id))
};