import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Auth from './Auth/Auth';
import ChatPage from './Chat/ChatPage';
import { Provider } from 'react-redux';
import store from './store';

class App extends Component {

	constructor() {
		super();
	}
	

	render() {
		return (
			<Provider store={store}>
				<Router>
					<div className="App">
					<Switch>
						<Route
							path={"/auth"}
							render={props => (
								<Auth {...props} handleLogin={this.handleLogin} />
							)} />
						<Route
							exact
							path={"/chat"}
							render={props => (
								<ChatPage {...props}/>
							)} />
					</Switch>
					</div>
				</Router>
			</Provider>
		);
	}

}

export default App;
