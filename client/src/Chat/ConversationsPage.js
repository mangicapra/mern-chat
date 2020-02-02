import React, { Component } from "react";
import { Button, Modal } from 'semantic-ui-react';
import axios from 'axios';

class ConversationsPage extends Component {

    constructor(props) {
        super(props);
        console.log(props)

        this.state = {
            modalOpen: false,
            conversationUsers: []
        }
    }

    render() {
        return (
            <div>
                <h4>Started conversations</h4>

                <Modal size="mini" open={this.state.modalOpen} trigger={<Button onClick={this.openModal} primary>New Chat</Button>}>
                    <Modal.Header>Start a conversation with:</Modal.Header>
                    <Modal.Content>
                        {this.state.conversationUsers.map((user, index) => {
                            return (
                                <div key={index} style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                                    <p>{user.name}</p>
                                    <Button color='purple' size='mini' onClick={this.startNewConversation.bind(this, user._id)}>Chat</Button>
                                </div>
                            )
                        })}
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
        console.log(id)
        axios.post('http://localhost:8080/api/conversations', JSON.stringify({id}), {
            headers: {
                "Content-Type": "application/json",
                "token": this.props.token
            }
        })
        .then(res => res.data).then(data => console.log(data))
        .catch(err => console.log(err));
    }

}

export default ConversationsPage;