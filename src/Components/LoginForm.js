import React, { Component } from 'react';

export default class LoginForm extends Component {
	constructor(props) {
		super(props);
		this.state = {
			user: '',
      loggedIn: false
		}
		this.handleInputChange = this.handleInputChange.bind(this);
    this.onLogin = this.onLogin.bind(this);
    this.onRename = this.onRename.bind(this);
  }

  onLogin() {
    this.props.submit(this.state.user);
    this.setState({
      loggedIn: true
    })
  }

  onRename() {
    this.props.rename(this.state.user);
  }

	handleInputChange(e) {
    this.setState({
     	user: e.target.value
    })
  }

	render() {
		return (
			<div className = 'login-form-container'> 
          		<label> {this.state.loggedIn ? 'Change your username: ' : 'Your username goes here: '} </label>
          		<input 
          			type="text" 
          			value = {this.state.user} 
          			onChange={this.handleInputChange} 
          			onKeyPress={(e) => {
          				if (e.key === 'Enter') {
            				if (!this.state.loggedIn) this.onLogin();
                    else this.onRename();
                  }
        		}}>
        		</input>
        		<button onClick={() => {
              if (!this.state.loggedIn) this.onLogin();
        		  else this.onRename();
            }}> {this.state.loggedIn ? 'Change' : 'Login'} </button>
      </div>
    )
	}
}