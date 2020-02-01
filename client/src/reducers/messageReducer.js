import { GET_MESSAGES, SEND_MESSAGE, DELETE_MESSAGE } from '../actions/types';

const initialState = {
    messages: []
}

export default function(state = initialState, action) {
    switch (action.type) {
        case GET_MESSAGES:
            return {
                ...state,
                messages: action.payload
            }

        case DELETE_MESSAGE:
            return {
                ...state,
                messages: state.messages.filter(message => message._id !== action.payload)
            }
        
        case SEND_MESSAGE:
            return {
                ...state,
                messages: [...state.messages, action.payload]
            }
    
        default:
            return state;
    }
};
