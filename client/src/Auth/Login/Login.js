import React, { Component } from 'react'
import { Button, Form, Grid, Header, Message, Segment } from 'semantic-ui-react'
import axios from 'axios';

class Login extends Component {

  constructor(props) {
    super(props);

    this.state = {
        email: '',
        password: '',
        loginErrors: ''
    };
}

    render() {
        return (
        <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as='h2' color='teal' textAlign='center'>
            Log-in to your account
          </Header>
          <Form onSubmit={this.handleSubmit}  size='large'>
            <Segment stacked>
              <Form.Input onChange={this.handleChange} name="email" fluid icon='mail' iconPosition='left' placeholder='E-mail address' />
              <Form.Input
                onChange={this.handleChange}
                name="password"
                fluid
                icon='lock'
                iconPosition='left'
                placeholder='Password'
                type='password'
              />
    
              <Button type="submit" color='teal' fluid size='large'>
                Login
              </Button>
            </Segment>
          </Form>
          <Message>
            New to us? <a href='/auth/register'>Sign Up</a>
          </Message>
        </Grid.Column>
      </Grid>
      )
    }

    handleSubmit = () => {
      const {email, password} = this.state

      axios.post('http://localhost:8080/api/auth', JSON.stringify({email, password}), {
        headers: {
            "Content-Type": "application/json"
        }
      }).then(res => res.data).then(body => {
        if(body.status === 'created') {
          this.setState({
            email: '',
            password: '',
            loginErrors: ''
          });
          
          this.props.handleSuccessfulAuth(body)
        }
      })
    }

    handleChange = e => this.setState({[e.target.name]: e.target.value});
}

export default Login;