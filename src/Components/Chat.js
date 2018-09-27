import React, { Component } from 'react';
import io from 'socket.io-client';
import Input from './Input.js';
import UserList from './UserList.js';
import MessageGenerator from '../Services/MessageGenerator.js';

const MAPPINGS = (ctx) => {
	return {
		'user join': ctx.userJoin,
		'user disconnect': ctx.userDisconnect,
		'chat message': ctx.receiveMessage,
		'user rename': ctx.userRename,
		'user leave': ctx.userLeave,
		'room change': ctx.roomChange,
		'chat history': ctx.receiveHistory, 
	}
}

const MESSAGE_TYPE = {
	USER_MESSAGE: 'user message',
	STATUS_UPDATE: 'status update',
	USER_RENAME: 'user rename'
}

const MAX_LENGTH = -1;

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
		this.userJoin = this.userJoin.bind(this);
		this.userDisconnect = this.userDisconnect.bind(this);
		this.userRename = this.userRename.bind(this);
		this.userLeave = this.userLeave.bind(this);
		this.receiveMessage = this.receiveMessage.bind(this);
		this.roomChange = this.roomChange.bind(this);
		this.receiveHistory = this.receiveHistory.bind(this);
	}

	componentDidMount() {
		for (let key in MAPPINGS(this)) {
			this.socket.on(key, (msg) => {
				MAPPINGS(this)[key](msg);
			})
		}

		this.setState({
			messages: [{
				user: 'You',
				content: ' connected to Global chat',
				type: MESSAGE_TYPE.STATUS_UPDATE
			}]
		})
	}

	componentDidUpdate(prevProps, prevState) {
		const messagesContainer = document.getElementById('messages-container');
		messagesContainer.scrollTop = messagesContainer.scrollHeight;

		if (prevProps.user !== this.props.user) {
			this.userRename({
				prevUser: prevProps.user,
				newUser: this.props.user,
			});
		}
	}

	userJoin(msg) {
		this.setState((prevState) => {
			return {
				messages: prevState.messages.concat({
					user: msg,
					content: ' has joined the room!',
					type: MESSAGE_TYPE.STATUS_UPDATE,
				})
			}
		})
	}

	userDisconnect(msg) {
		if (msg !== null) {
			this.setState((prevState) => {
				return {
					messages: prevState.messages.concat({
						user: msg,
						content: ' has disconnected!',
						type: MESSAGE_TYPE.STATUS_UPDATE,
					})
				}
			});
		}
	}

	userLeave(msg) {
		this.setState(prevState => {
			return {
				messages: prevState.messages.concat({
					user: msg,
					content: ' has left the room!',
					type: MESSAGE_TYPE.STATUS_UPDATE
				})
			}
		})
	}

	userRename(msg) {
		this.setState((prevState) => {
			let prevMessages = JSON.parse(JSON.stringify(prevState.messages));
			prevMessages.forEach(el => {
				if (el.user === msg.prevUser && el.type !== MESSAGE_TYPE.STATUS_UPDATE) {
					el.user = msg.newUser;
				}
			});

			prevMessages.push({
				user: msg.prevUser,
				content: ' changed their name to ' + msg.newUser,
				type: MESSAGE_TYPE.USER_RENAME
			});

			return {
				messages: prevMessages
			}
		})
	}

	sendMessage(msg) {
		const messageToSend = {
			user: this.props.user,
			time: new Date(),
			content: msg,
			type: MESSAGE_TYPE.USER_MESSAGE
		}

		this.setState((prevState) => {
			return {
				messages: prevState.messages.concat(messageToSend)
			}
		});

		this.socket.emit('chat message', messageToSend);
	}

	receiveMessage(msg) {
		this.setState((prevState) => {
			return {
				messages: prevState.messages.concat(msg)
			}
		})
	}

	roomChange(room) {
		this.setState({
			messages: [{
				user: 'You',
				content: ' switched to ' + room,
				type: MESSAGE_TYPE.STATUS_UPDATE
			}]
		})
	}

	receiveHistory(msg) {
		this.setState({
			messages: msg
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
				{this.state.messages.length < MAX_LENGTH &&
					<div className = 'dropdown-history-alert'>
							Scroll up to see more messages
					</div>
				}
				<div id = 'messages-container'>
					<div className = 'messages'>
						{this.state.messages.map(msg => {
							return MessageGenerator(msg.type, this.props.user, msg);
						})}
					</div>
				</div>
				<div id = 'message-input-container'>
					<Input send = {this.sendMessage}/>
				</div>
				<button onClick = {this.clearChat}>
					Clear chat history
				</button>
				<UserList connection = {this.socket} />
			</div>
		)
	}
}