import React, { Component } from 'react';
import io from 'socket.io-client';

class ChatConnection {
	constructor(user) {
		this.state = {
			lastMessage: ''	
		}
		this.socket = io();
		this.socket.emit('login', user);
	}
}

export default ChatConnection;