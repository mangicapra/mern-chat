import React, { Component } from "react";
import { Comment, Icon } from 'semantic-ui-react';

class MessagesContainer extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return(
            <Comment.Group>
                {this.props.messages.map((message, index) => {
                    return (
                        <Comment key={`c${index}`}>
                            <Comment.Author as="b">{message.sender} <Icon onClick={this.props.removeMessage.bind(this, message._id)} link name='close' /></Comment.Author>
                            <Comment.Text>{message.content}</Comment.Text>
                        </Comment>
                    )
                })}
            </Comment.Group>
        );
    }
}

export default MessagesContainer;