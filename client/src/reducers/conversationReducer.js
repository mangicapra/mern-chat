import { GET_CONVERSATIONS, ADD_CONVERSATION, DELETE_CONVERSATION } from '../actions/types';

const initialState = {
    conversations: []
}

export default function(state = initialState, action) {
    switch (action.type) {
        case GET_CONVERSATIONS:
            return {
                ...state,
                conversations: action.payload
            }

        case DELETE_CONVERSATION:
            return {
                ...state,
                conversations: state.conversations.filter(conversation => conversation._id !== action.payload)
            }
        
        case ADD_CONVERSATION:
            return {
                ...state,
                conversations: [...state.conversations, action.payload]
            }
    
        default:
            return state;
    }
};
