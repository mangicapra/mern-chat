import React, { Component } from 'react'
import { Button, Form, Grid, Header, Message, Segment } from 'semantic-ui-react'
import {Link} from "react-router-dom";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { login } from '../../actions/authActions';
import { clearErrors } from '../../actions/errorActions';

class Login extends Component {

  constructor(props) {
    super(props);

    this.state = {
        email: '',
        password: '',
        msg: ''
    };
}

componentDidUpdate(prevProps) {
  const {error} = this.props;

  if(error !== prevProps.error) {
    if(error.id === 'LOGIN_FAIL') {
      this.setState({
        msg: error.msg.msg
      })
    } else {
      this.setState({msg: null})
    }
  }
}

static propTypes = {
  isAuthenticated: PropTypes.bool,
  error: PropTypes.object.isRequired,
  login: PropTypes.func.isRequired,
  clearErrors: PropTypes.func.isRequired
};

    render() {
        return (
        <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as='h2' color='teal' textAlign='center'>
            Log-in to your account
          </Header>
          <Form onSubmit={this.handleSubmit}  size='large'>
            <Segment stacked>
              {this.state.msg ? <Message style={{color: 'red'}}>{this.state.msg}</Message> : null}
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
            New to us? <Link to="/register">Sign Up</Link>
          </Message>
        </Grid.Column>
      </Grid>
      )
    }

    handleSubmit = () => {
      const {email, password} = this.state
      this.props.clearErrors();

      const user = {email, password};

      this.props.login(user, this.props.history);
    }

    handleChange = e => this.setState({[e.target.name]: e.target.value});
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  error: state.error
})

export default connect(mapStateToProps, {login, clearErrors})(Login);