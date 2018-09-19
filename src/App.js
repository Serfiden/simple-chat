import React, { Component } from 'react';
import io from 'socket.io-client';
import './App.css';
import Chat from './Components/Chat.js';
import LoginForm from './Components/LoginForm.js';
import RoomSelect from './Components/RoomSelect.js';
import PrivateMessageContext from './Components/PrivateMessageContext.js';

class App extends Component {
  constructor() {
    super();
    this.state = {
      loggedIn: false,
      user: '',
      newPrivateReceiver: '',
    }
    this.connection = null;
    this.chatSelect = null;
    this.login = this.login.bind(this);
    this.rename = this.rename.bind(this);
    this.createPrivateRoom = this.createPrivateRoom.bind(this);
  }

  componentDidMount() {
    this.connection = io();
  }

  login(user) {
    this.connection.emit('login', user);
    this.setState(prevState => {
      return {
        user: user,
        loggedIn: true,
      }
    });
  }

  rename(user) {
    this.setState(prevState => {
      this.connection.emit('user rename', {
        prevUser: prevState.user,
        newUser: user
      });
      return {
        user: user
      }
    });
  }

  createPrivateRoom(user) {
    this.setState({
      newPrivateReceiver: user
    })
  }

  render() {
    return (
      <div>
        {this.state.loggedIn &&
          <PrivateMessageContext.Provider 
            value = {{
              receiver: this.state.newPrivateReceiver, 
              createPrivateRoom: this.createPrivateRoom,
              user: this.state.user}}>
            <div className = 'app-container'>
              <Chat user = {this.state.user} connection = {this.connection}/>
              <PrivateMessageContext.Consumer>
                {({receiver, user}) => (
                  <RoomSelect connection = {this.connection} privateReceiver = {receiver} user = {user}/>
                )}
              </PrivateMessageContext.Consumer>
            </div>
          </PrivateMessageContext.Provider>
        }           
        <LoginForm submit = {this.login} rename = {this.rename}/>
      </div>
    );

  }
}

export default App;
