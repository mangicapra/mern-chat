import React, { Component } from "react";
import { Form, Button } from 'semantic-ui-react';

class InputContainer extends Component {

    constructor(props) {
        super(props);

        this.state = {
            content: ''
        };
    }

    render() {
        return(
            <Form onSubmit={this.handleSubmit}>
                <Form.Input 
                    value={this.state.content} 
                    required 
                    placeholder="Enter your message here" 
                    onChange={e => this.setState({content: e.target.value})}
                    />
                <Button type="submit">Send</Button>
            </Form>
        )
    }

    handleSubmit = () => {
        this.props.handleSubmit(this.state.content);
        this.setState({
            content: ''
        });
    }
}

export default InputContainer;