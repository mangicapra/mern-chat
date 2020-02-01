import React, { Component } from 'react'
import { Button, Form, Grid, Header, Message, Segment } from 'semantic-ui-react'
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { register } from '../../actions/authActions';
import { clearErrors } from '../../actions/errorActions';
import {Link} from "react-router-dom";

class Register extends Component {

  constructor(props) {
    super(props);

    this.state = {
        name: '',
        email: '',
        password: '',
        msg: ''
    };
}

componentDidUpdate(prevProps) {
  const {error} = this.props;

  if(error !== prevProps.error) {
    if(error.id === 'REGISTER_FAIL') {
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
  register: PropTypes.func.isRequired,
  clearErrors: PropTypes.func.isRequired
};

    render() {
        return (
        <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as='h2' color='teal' textAlign='center'>
            Create new account
          </Header>
          <Form onSubmit={this.handleSubmit} size='large'>
            <Segment stacked>
              {this.state.msg ? <Message style={{color: 'red'}}>{this.state.msg}</Message> : null}
              <Form.Input fluid onChange={this.handleChange} type="text" icon='user' name="name" iconPosition='left' placeholder='Full name' />
              <Form.Input fluid onChange={this.handleChange} type="email" icon='mail' name="email" iconPosition='left' placeholder='E-mail address' />
              <Form.Input
                fluid 
                onChange={this.handleChange}
                name="password"
                icon='lock'
                iconPosition='left'
                placeholder='Password'
                type='password'
              />
    
              <Button type="submit" color='teal' fluid size='large'>
                Register
              </Button>
            </Segment>
          </Form>
          <Message>
            Have an account? <Link to="">Sign in</Link>
          </Message>
        </Grid.Column>
      </Grid>
      )
    }

    handleSubmit = () => {
      this.props.clearErrors();
      const {name, email, password} = this.state

      const newUser = {name, email, password};

      this.props.register(newUser, this.props.history);
    }

    handleChange = e => this.setState({[e.target.name]: e.target.value});
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  error: state.error
})

export default connect(mapStateToProps, {register, clearErrors})(Register);