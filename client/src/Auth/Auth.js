// import React, { Component } from 'react'
// import Register from './Register/Register';
// import Login from './Login/Login';
// import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

// class Auth extends Component {

//     constructor(props) {
//         super(props);
//     }

//     render() {  
//         return (
//             <Router>
//                 <Switch>
//                     <Route
//                     path={"/auth/register"}
//                     render={() => (
//                         <Register history={this.props.history} handleSuccessfulAuth={this.handleSuccessfulAuth} />
//                     )} />
//                     <Route
//                     path={"/auth/login"}
//                     render={() => (
//                         <Login handleSuccessfulAuth={this.handleSuccessfulAuth} />
//                     )} />
//                 </Switch>
//             </Router>
//         )
//     }

//     handleSuccessfulAuth = data => {
//         this.props.handleLogin(data);
//         this.props.history.push('/chat')
//     }
// }

// export default Auth;