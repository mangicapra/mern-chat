import React, { Component } from "react";
import { Button, Modal } from 'semantic-ui-react';
import axios from 'axios';
import { getConversations, deleteConversation, newConversation } from '../actions/conversationActions';
import { connect } from 'react-redux';
import store from '../store';
import { Icon } from 'semantic-ui-react';
import { DELETE_CONVERSATION, ADD_CONVERSATION } from "../actions/types";

class ConversationsPage extends Component {

    constructor(props) {
        super(props);

        this.state = {
            modalOpen: false,
            conversationUsers: []
        }

        this.props.socket.on('add-conversation', conversation => {
            store.dispatch({
                type: ADD_CONVERSATION,
                payload: conversation
            })
        });

        this.props.socket.on('delete-conversation', conversationId => {
            store.dispatch({
                type: DELETE_CONVERSATION,
                payload: conversationId
            })
        });
    }

    componentDidMount() {
        store.dispatch(getConversations(this.props.token));
    }

    render() {
        const { conversations } = this.props.conversation;
        return (
            <div>
                <h4>Started conversations</h4>

                {
                    conversations.length > 0 
                    ?
                    conversations.map((conversation, i) => {
                        return (
                            <div key={`conv${i}`}>
                                <p>{conversation._id} <Icon onClick={this.deleteConversation.bind(this, conversation._id)} link name='close' /></p>
                            </div>
                        );
                    })
                    :
                    <p>There are no conversations.</p>
                }

                <Modal size="mini" open={this.state.modalOpen} trigger={<Button style={{marginTop: '20px'}} onClick={this.openModal} primary>New Chat</Button>}>
                    <Modal.Header>Start a conversation with:</Modal.Header>
                    <Modal.Content>
                        {this.state.conversationUsers.length > 0 ? this.state.conversationUsers.map((user, index) => {
                            return (
                                <div key={index} style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                                    <p>{user.name}</p>
                                    <Button color='purple' size='mini' onClick={this.startNewConversation.bind(this, user._id)}>Chat</Button>
                                </div>
                            )
                        }) : <p>There are no users!</p>}
                    </Modal.Content>
                    <Modal.Actions>
                        <Button onClick={this.closeModal} negative>Close</Button>
                    </Modal.Actions>
                </Modal>
            </div>
        )
    }

    openModal = () => {
        this.setState({ modalOpen: true })
        this.getConversationUsers();
    }
    closeModal = () => {
        this.setState({ modalOpen: false })
    }

    getConversationUsers = token => {
        axios.get('http://localhost:8080/api/conversations/users', {
            headers: {
                "Content-Type": "application/json",
                "token": this.props.token
            }
        })
        .then(res => res.data).then(data => this.setState({conversationUsers: data}))
        .catch(err => console.log(err));
    }

    startNewConversation = id => {
        this.props.newConversation(this.props.token, id, this.props.socket);
        this.closeModal();
    }

    deleteConversation = id => {
        this.props.deleteConversation(this.props.token, id, this.props.socket)
    }

}

const mapStateToProps = (state) => ({ conversation: state.conversation });
export default connect(mapStateToProps, { getConversations, deleteConversation, newConversation })(ConversationsPage);
