import React, { Component } from "react";
import { Grid } from 'semantic-ui-react';
import MessagesContainer from './MessagesContainer';
import InputContainer from './InputContainer';
import './ChatPage.css';
import io from 'socket.io-client';
import { connect } from 'react-redux';
import { getMessages, deleteMessage, sendMessage } from '../actions/messageActions';
import PropTypes from 'prop-types';
import store from '../store';
import { loadUser } from '../actions/authActions'
import { SEND_MESSAGE, DELETE_MESSAGE } from "../actions/types";

let socket;
let token;

class ChatPage extends Component {

    constructor(props) {
        super(props);
        token = store.getState().auth.token;

        socket = io.connect('http://localhost:8080');

        socket.on('new-message', message => {
            store.dispatch({
                type: SEND_MESSAGE,
                payload: message
            })
        });

        socket.on('delete-message', messageId => {
            store.dispatch({
                type: DELETE_MESSAGE,
                payload: messageId
            })
        });
    }

    componentDidMount() {
        store.dispatch(loadUser());
        this.props.getMessages(token);
    }

    componentWillUnmount() {
        socket.disconnect()
    }
    

    render() {
        const { messages } = this.props.message;
        return(
            <Grid>
            <p>{this.props.loggedInStatus}</p>
                <Grid.Column width={4} />
                <Grid.Column width={8}>
                    <Grid.Row className="messages-container">
                        {messages.length > 0 ?
                        <MessagesContainer removeMessage={this.removeMessage} messages={messages} />
                        :
                        <div></div>
                        }
                    </Grid.Row>

                    <Grid.Row>
                        <InputContainer handleSubmit={this.handleSubmit}/>
                    </Grid.Row>
                </Grid.Column>
                <Grid.Column width={4} />
            </Grid>
        )
    }

    handleSubmit = (content) => {
        const user = store.getState().auth.user;
        const body = {
            sender: user.name,
            content
        };

        this.props.sendMessage(token, body, socket);
    }

    removeMessage = messageId => {
        this.props.deleteMessage(token, messageId, socket)
    }
}

ChatPage.propTypes = {
    getMessages: PropTypes.func.isRequired,
    message: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({ message: state.message });

export default connect(mapStateToProps, { getMessages, deleteMessage, sendMessage })(ChatPage);