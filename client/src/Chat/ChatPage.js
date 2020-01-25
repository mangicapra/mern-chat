import React, { Component } from "react";
import { Grid } from 'semantic-ui-react';
import MessagesContainer from './MessagesContainer';
import InputContainer from './InputContainer';
import './ChatPage.css';
import io from 'socket.io-client';
import { connect } from 'react-redux';
import { getMessages, deleteMessage, sendMessage, addNewMessageSocket, removeMessageSocket } from '../actions/messageActions';
import PropTypes from 'prop-types';
import store from '../store';
import { loadUser } from '../actions/authActions'

let socket;
let token;

class ChatPage extends Component {

    constructor(props) {
        super(props);
        token = store.getState().auth.token;

        socket = io.connect('http://localhost:8080');

        socket.on('new-message', message => {
            this.props.sendMessage(token, message);
        });

        socket.on('delete-message', messageId => {
            this.props.deleteMessage(token, messageId)
        });
    }

    componentDidMount() {
        store.dispatch(loadUser());
        this.props.getMessages(token);
    }

    componentWillUnmount() {
        socket.disconnect()
        alert("Disconnecting Socket as component will unmount")
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

        this.props.addNewMessageSocket(socket, body)
    }

    removeMessage = messageId => {
        this.props.removeMessageSocket(socket, messageId)
    }
}

ChatPage.propTypes = {
    getMessages: PropTypes.func.isRequired,
    message: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({ message: state.message });

export default connect(mapStateToProps, { getMessages, deleteMessage, sendMessage, addNewMessageSocket, removeMessageSocket })(ChatPage);