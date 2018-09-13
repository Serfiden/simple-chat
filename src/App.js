import React, { Component } from 'react';
import io from 'socket.io-client';
import './App.css';
import Chat from './Components/Chat.js';
import LoginForm from './Components/LoginForm.js';
import UserList from './Components/UserList.js';

class App extends Component {
  constructor() {
    super();
    this.state = {
      loggedIn: false,
      user: ''
    }
    this.connection = io();
    this.login = this.login.bind(this);
  }

  login(user) {
    this.setState({
      user: user,
      loggedIn: true
    })
  }

  render() {
    return (
      <div>
        {this.state.loggedIn ?
          <React.Fragment>
            <Chat user = {this.state.user} connection = {this.connection}/> 
            <UserList connection = {this.connection} />
          </React.Fragment> :
            <LoginForm submit = {this.login} />
        }
      </div>
    );
  }
}

export default App;
