import React, { Component } from 'react';
import User from './User.js';
import PrivateMessageContext from './PrivateMessageContext.js';

const MAPPINGS = (ctx) => {
	return {
		'online users': ctx.showOnlineUsers,
		'user join': ctx.userConnect,
		'user disconnect': ctx.userLeave,
		'user rename': ctx.userRename,
		'user leave': ctx.userLeave,
	}
}

export default class UserList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			users: [],
			newPrivateReceiver: ''
		}
		this.socket = props.connection;
		this.showOnlineUsers = this.showOnlineUsers.bind(this);
		this.userConnect = this.userConnect.bind(this);
		this.userLeave = this.userLeave.bind(this);
		this.userRename = this.userRename.bind(this);
		this.openPrivateRoom = this.openPrivateRoom.bind(this);
	}

	componentDidMount() {
		for (let key in MAPPINGS(this)) {
			this.socket.on(key, (msg) => {
				MAPPINGS(this)[key](msg);
			})
		}
	}

	showOnlineUsers(users) {
		this.setState({
			users: users
		});
	}

	userConnect(user) {
		this.setState((prevState) => {
			let connectedUsers = prevState.users.concat(user);
			return {
				users: connectedUsers
			}
		});
	}

	userLeave(user) {
		this.setState((prevState) => {
			let connectedUsers = prevState.users.concat();
			connectedUsers.splice(connectedUsers.indexOf(user), 1);
			return {
				users: connectedUsers
			}
		})
	}

	userRename(msg) {
		this.setState(prevState => {
			let users = JSON.parse(JSON.stringify(prevState.users));
			users[users.indexOf(msg.prevUser)] = msg.newUser;
			return {
				users: users
			}
		})
	}

	openPrivateRoom(e) {
		this.setState({
			newPrivateReceiver: e.target.innerText
		}) 
	}

	render() {
		return (
		<PrivateMessageContext.Consumer>
		{({createPrivateRoom}) => ( 
			<div className = 'users-list-container' onClick = {e => createPrivateRoom(e.target.innerText)}>
				{this.state.users.map((user) => <User name = {user} />)}
			</div>
		)}
		</PrivateMessageContext.Consumer>
		)
	}
}