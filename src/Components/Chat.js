import React, { Component } from 'react';
import io from 'socket.io-client';
import Message from './Message.js';
import Input from './Input.js';
import UserList from './UserList.js';

const MAX_LENGTH = 5;

export default class Chat extends Component {
	constructor(props) {
		super(props);
		this.state = {
			messages: [],
		}
		this.message = '';
		this.socket = props.connection;
		this.handleInputChange = this.handleInputChange.bind(this);
		this.sendMessage = this.sendMessage.bind(this);
		this.clearChat = this.clearChat.bind(this);
		this.init();
	}

	componentDidUpdate() {
		const messagesContainer = document.getElementById('messages-container');
		messagesContainer.scrollTop = messagesContainer.scrollHeight;
	}

	init() {
		this.socket.emit('login', this.props.user);
		this.socket.on('user connect', (msg) => {
			this.userConnect(msg);
		});
		this.socket.on('chat message', (msg) => {
			this.receiveMessage(msg);
		});
		this.socket.on('user disconnect', (msg) => {
			this.userDisconnect(msg);
		})
	}

	userConnect(msg) {
		this.setState((prevState) => {
			let messages = prevState.messages;
			messages.push(<p> {msg + ' has joined the room!'} </p>);
			return {
				messages: messages
			}
		});
	}

	userDisconnect(msg) {
		this.setState((prevState) => {
			let messages = prevState.messages;
			messages.push(<p> {msg} has disconnected! </p>);
			return {
				messages: messages
			}
		})
	}

	sendMessage(msg) {
		let time = new Date(),
			user = this.props.user;

		this.setState((prevState) => {
			let messages = prevState.messages;
			messages.push(<Message data = {{
				user: 'You',
				time: time,
				content: msg
			}} src="in"/>);

			return {
				messages: messages
			}
		})
		this.socket.emit('chat message', {
			user: user,
			time: time,
			content: msg
		})
	}

	receiveMessage(msg) {
		this.setState((prevState) => {
			let messages = prevState.messages;
			messages.push(<Message data={msg} src="out"/>);
			return {
				messages: messages
			}
		})
	}

	clearChat() {
		this.setState({
			messages: []
		})
	}

	handleInputChange(e) {
		this.message = e.target.value;
	}

	render() {
		return (
			<div className = 'chat-container'>
				<h1>Welcome to this unimpressive chat room, {this.props.user}</h1>
				{this.state.messages.length > MAX_LENGTH &&
					<div className = 'dropdown-history-alert'>
							Scroll up to see more messages
					</div>
				}
				<div id = 'messages-container'>
					<div className = 'messages'>
						{this.state.messages}
					</div>
				</div>
				<div id = 'message-input-container'>
					<Input send = {this.sendMessage}/>
				</div>
				<button onClick = {this.clearChat}>
					Clear chat history
				</button>
			</div>
		)
	}
}